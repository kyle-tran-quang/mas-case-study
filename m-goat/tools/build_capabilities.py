"""Builds m-goat/capabilities-data.js from the two Figma SVG exports (Capabilities morph 1 = illustration, morph 2 = diagram).
Usage: python3 -I tools/build_capabilities.py <art.svg> <diagram.svg> <out.js>
Everything is measured from the exports; nothing is hand-drawn. The illustration's own paths are sampled by arc length so the scene can morph
them (point-for-point) into the diagram's connector and cards. Card text/icons are the exported glyph outlines, never re-typeset."""
import re, sys, json, math
import xml.etree.ElementTree as ET
SVG = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG)
ns = "{%s}" % SVG
ART_OFF = (36.0, 286.0)          # Art frame position inside the 720 x 1024 stage (Figma 90:12876)
N_SHAPE, N_LINE = 96, 160

def parse_path(d):
    letters = set(re.findall(r"[A-Za-z]", d))
    assert letters <= set("MLHVCZ"), letters
    toks = re.findall(r"[MLHVCZ]|-?\d*\.?\d+(?:e-?\d+)?", d)
    segs, i, cur, start = [], 0, (0.0, 0.0), (0.0, 0.0)
    cmd = None
    def num():
        nonlocal i
        v = float(toks[i]); i += 1; return v
    while i < len(toks):
        if re.match(r"[MLHVCZ]", toks[i]): cmd = toks[i]; i += 1
        if cmd == "M": cur = (num(), num()); start = cur; cmd = "L"
        elif cmd == "L": p = (num(), num()); segs.append(("L", cur, p)); cur = p
        elif cmd == "H": p = (num(), cur[1]); segs.append(("L", cur, p)); cur = p
        elif cmd == "V": p = (cur[0], num()); segs.append(("L", cur, p)); cur = p
        elif cmd == "C": c1 = (num(), num()); c2 = (num(), num()); p = (num(), num()); segs.append(("C", cur, c1, c2, p)); cur = p
        elif cmd == "Z":
            if cur != start: segs.append(("L", cur, start)); cur = start
    return segs

def flatten(segs):
    pts = []
    for s in segs:
        if s[0] == "L": steps = [s[1], s[2]]
        else:
            p0, c1, c2, p1 = s[1:]
            steps = [tuple((1-t)**3*p0[k] + 3*(1-t)**2*t*c1[k] + 3*(1-t)*t*t*c2[k] + t**3*p1[k] for k in (0, 1)) for t in [j/40 for j in range(41)]]
        for q in steps:
            if not pts or math.hypot(q[0]-pts[-1][0], q[1]-pts[-1][1]) > 1e-9: pts.append(q)
    return pts

def sample(pts, n, closed):
    if closed and pts[0] != pts[-1]: pts = pts + [pts[0]]
    cum = [0.0]
    for a, b in zip(pts, pts[1:]): cum.append(cum[-1] + math.hypot(b[0]-a[0], b[1]-a[1]))
    total = cum[-1]; out = []; j = 0
    count = n if closed else n - 1
    for k in range(n):
        target = total * k / count
        while j < len(cum) - 2 and cum[j+1] < target: j += 1
        seg = cum[j+1] - cum[j]; u = 0 if seg == 0 else (target - cum[j]) / seg
        out.append((pts[j][0] + (pts[j+1][0]-pts[j][0])*u, pts[j][1] + (pts[j+1][1]-pts[j][1])*u))
    return out

def sample_segs(segs, n, closed):
    """Arc-length sampling that always includes every segment boundary, so sharp corners (leaf tips, plug corners) survive the morph."""
    polys, lens = [], []
    for sg in segs:
        pts = flatten([sg]); L = sum(math.hypot(b[0]-a[0], b[1]-a[1]) for a, b in zip(pts, pts[1:]))
        if L > 1e-6: polys.append(pts); lens.append(L)
    total = sum(lens); want = n if closed else n - 1
    raw = [want * L / total for L in lens]; cnt = [max(1, int(r)) for r in raw]
    while sum(cnt) < want:
        i = max(range(len(cnt)), key=lambda k: raw[k] - cnt[k]); cnt[i] += 1
    while sum(cnt) > want:
        i = max(range(len(cnt)), key=lambda k: cnt[k] - raw[k]);
        if cnt[i] <= 1: break
        cnt[i] -= 1
    out = []
    for pts, L, c in zip(polys, lens, cnt):
        cum = [0.0]
        for a, b in zip(pts, pts[1:]): cum.append(cum[-1] + math.hypot(b[0]-a[0], b[1]-a[1]))
        j = 0
        for k in range(c):
            target = L * k / c
            while j < len(cum) - 2 and cum[j+1] < target: j += 1
            seg = cum[j+1] - cum[j]; u = 0 if seg == 0 else (target - cum[j]) / seg
            out.append((pts[j][0] + (pts[j+1][0]-pts[j][0])*u, pts[j][1] + (pts[j+1][1]-pts[j][1])*u))
    if not closed: out.append(polys[-1][-1])
    return out

def rect_pts(x, y, w, h, n):
    per = n // 4; out = []
    for k in range(per): out.append((x + w*k/per, y))
    for k in range(per): out.append((x + w, y + h*k/per))
    for k in range(per): out.append((x + w - w*k/per, y + h))
    for k in range(per): out.append((x, y + h - h*k/per))
    return out

def best_align(src, dst, allow_rot):
    n = len(src); best = None
    sc = center(src) if allow_rot else (0, 0); dc = center(dst) if allow_rot else (0, 0)
    for rev in (False, True):
        s = src[::-1] if rev else src
        shifts = range(n) if allow_rot else [0]
        for sh in shifts:
            c = sum((s[(i+sh) % n][0]-sc[0]-dst[i][0]+dc[0])**2 + (s[(i+sh) % n][1]-sc[1]-dst[i][1]+dc[1])**2 for i in range(n))
            if best is None or c < best[0]: best = (c, [s[(i+sh) % n] for i in range(n)])
    return best[1]

def flat(pts): return [round(v, 2) for p in pts for v in p]
def center(pts): return (sum(p[0] for p in pts)/len(pts), sum(p[1] for p in pts)/len(pts))
def add_off(pts): return [(p[0]+ART_OFF[0], p[1]+ART_OFF[1]) for p in pts]

art_path, diagram_path, out_path = sys.argv[1:4]
art = ET.parse(art_path).getroot()
parent = {c: p for p in art.iter() for c in p}
def anc_ids(e):
    out = []
    while e in parent: e = parent[e]; out.append(e.get("id", ""))
    return out

BLUE_SEEDS = ["Vector_3", "Vector_7", "Vector_56", "Vector_58", "Vector_60"]
LILAC_SEEDS = ["Vector_27", "Vector_31", "Vector_34"]
NODE_IDS = ["Vector_50", "Vector_51", "Vector_52", "Vector_53", "Vector_54", "Vector_55"]
RETAINED = "Vector_54"                 # the lower-left node: closest to the red endpoint (Vector_8 in the diagram)
ARC_IDS = ["Vector_11", "Vector_10", "Vector_9"]    # outer -> inner. The outer one becomes the loop; the others converge onto it and fade
# small details fade first (0-20%): window marks, stems, wheat, leaf ridges, plug prongs, platform capsules, short ticks
DETAIL_IDS = {"Vector", "Vector_2", "Vector_4", "Vector_5", "Vector_6", "Vector_8", "Vector_13", "Vector_14", "Vector_18", "Vector_19", "Vector_20", "Vector_21",
              "Vector_22", "Vector_23", "Vector_24", "Vector_28", "Vector_29", "Vector_32", "Vector_33", "Vector_35", "Vector_36", "Vector_57", "Vector_59",
              "Vector_61", "Vector_62"} | {"Vector_%d" % i for i in range(37, 49)}
wheat_ids = set()

shapes = {}; details = []; keep = []
paths = [(p, p.get("id", ""), anc_ids(p)) for p in art.iter(ns + "path")]
for p, pid, anc in paths:
    d = p.get("d"); fill = p.get("fill", "none"); stroke = p.get("stroke", "none")
    rec = {"d": d, "fill": fill, "stroke": stroke}
    if pid in BLUE_SEEDS + LILAC_SEEDS + NODE_IDS + ARC_IDS: shapes[pid] = (p, rec); continue
    if "wheat" in anc or pid in DETAIL_IDS: details.append(rec)
    else: keep.append(rec)

# the arcs are closed half-discs; their flat baseline is already drawn by the ground line (Vector_49, kept), so only the curved part morphs

def poly(pid, closed, n):
    segs = parse_path(shapes[pid][0].get("d"))
    if pid in ARC_IDS: segs = [g for g in segs if g[0] == "C"]       # the arcs are closed half-discs: keep only the curved part (the flat baseline is a separate detail)
    return add_off(sample_segs(segs, n, closed))

# ---- diagram -------------------------------------------------------------------------------------------------------------------------------
dia = ET.parse(diagram_path).getroot()
def find(root, i):
    for e in root.iter():
        if e.get("id") == i: return e
nodes = [e for e in dia.iter(ns + "g") if (e.get("id") or "").startswith("Large node - Icon default")]
def card_of(g):
    rects = [r for r in g if r.tag == ns + "rect"]
    outline = next(r for r in rects if r.get("stroke") and not r.get("id"))
    bg = next(r for r in rects if (r.get("id") or "").startswith("Background color"))
    return dict(x=float(outline.get("x")), y=float(outline.get("y")), w=float(outline.get("width")), h=float(outline.get("height")),
                stroke=outline.get("stroke"), fill=bg.get("fill"))
def content_of(g):
    g2 = ET.fromstring(ET.tostring(g)); pm = {c: p for p in g2.iter() for c in p}
    for r in [r for r in g2 if r.tag == ns + "rect"]: g2.remove(r)
    for e in list(g2.iter()):
        if e.tag == ns + "line" and (e.get("id") or "").startswith("Border"): pm[e].remove(e)
        if "clip-path" in e.attrib: del e.attrib["clip-path"]
    s = "".join(ET.tostring(c, encoding="unicode") for c in g2)
    return re.sub(r' id="[^"]*"', "", re.sub(r' xmlns="[^"]*"', "", s))
cards = []
box = None
for g in nodes:
    gid = g.get("id")
    if gid.endswith("_9"):
        r = [r for r in g if r.tag == ns + "rect"][1]
        s = re.sub(r' xmlns="[^"]*"', "", ET.tostring(g, encoding="unicode"))
        s = re.sub(r' clip-path="[^"]*"', "", s); s = re.sub(r' id="[^"]*"', "", s)
        box = dict(x=float(r.get("x")), y=float(r.get("y")), w=float(r.get("width")), h=float(r.get("height")), svg=s)
        continue
    c = card_of(g); c["content"] = content_of(g)
    c["side"] = "L" if c["stroke"].upper() == "#4589FF" else "R"
    cards.append(c)
left = sorted([c for c in cards if c["side"] == "L"], key=lambda c: c["y"])
right = sorted([c for c in cards if c["side"] == "R"], key=lambda c: c["y"])
assert len(left) == 7 and len(right) == 7 and box, (len(left), len(right))

def slots(n_seeds, n_cards): return [int(k * (n_cards - 1) / (n_seeds - 1) + 0.5) for k in range(n_seeds)] if n_seeds > 1 else [0]

def seed_cards(col, seed_ids):
    ordered = sorted(seed_ids, key=lambda i: (center(poly(i, True, 32))[1], center(poly(i, True, 32))[0]))
    sl = slots(len(ordered), len(col)); used = dict(zip(sl, ordered))
    for j, c in enumerate(col):
        c["i"] = j
        if j in used:
            sid = used[j]; src = poly(sid, True, N_SHAPE); dst = rect_pts(c["x"], c["y"], c["w"], c["h"], N_SHAPE)
            c["seedId"] = sid; c["seedD"] = shapes[sid][1]["d"]; c["seed"] = flat(best_align(src, dst, True)); c["seedFill"] = shapes[sid][1]["fill"]; c["seedStroke"] = "#022D0D"
        else:
            nearest = min(sl, key=lambda s: abs(s - j)); sid = used[nearest]; cx, cy = center(poly(sid, True, 32))
            c["near"] = nearest; c["seedFill"] = shapes[sid][1]["fill"]; c["seedStroke"] = "#022D0D"
seed_cards(left, BLUE_SEEDS); seed_cards(right, LILAC_SEEDS)

# connector: the loop, the right-hand drop to the "and 76 more" box, and the stub to the red node
loop_d = find(dia, "Vector 1").get("d"); drop_d = find(dia, "Vector 2").get("d"); stub_d = find(dia, "Vector 3").get("d")
loop_pts = sample_segs(parse_path(loop_d), N_LINE, False)
arcs = []
for aid in ARC_IDS:
    src = poly(aid, False, N_LINE); arcs.append(dict(id=aid, from_=flat(best_align(src, loop_pts, False)), stroke=shapes[aid][1]["stroke"]))
node_c = {}
for nid in NODE_IDS:
    c = center(poly(nid, True, 32)); node_c[nid] = [round(c[0], 2), round(c[1], 2)]
red = find(dia, "Vector_8"); rp = flatten(parse_path(red.get("d"))); rc = center(rp)
data = dict(
    details=details, keep=keep, artOffset=list(ART_OFF),
    arcs=[dict(id=a["id"], from_=a["from_"], stroke=a["stroke"]) for a in arcs], loop=flat(loop_pts), loopD=loop_d, loopStroke="#000000",
    nodes=[dict(id=n, c=node_c[n], retained=(n == RETAINED), fill="#E8DAFF", stroke="#022D0D") for n in NODE_IDS], redNode=dict(c=[round(rc[0], 3), round(rc[1], 3)], fill=red.get("fill"), stroke="#000000"),
    dropD=drop_d, stubD=stub_d, dropLen=139, stubLen=33,
    left=left, right=right, box=box, N_SHAPE=N_SHAPE, N_LINE=N_LINE, nodeR=7.415)
js = "/* GENERATED by tools/build_capabilities.py from the Figma exports (Capabilities morph 1 = 90:12696, morph 2 = 90:12148). Do not edit by hand. */\nwindow.CAP_DATA = " + json.dumps(data, separators=(",", ":")) + ";\n"
open(out_path, "w").write(js)
print("details", len(details), "keep", len(keep), "left", [("seed" if "seed" in c else "extra") for c in left], "right", [("seed" if "seed" in c else "extra") for c in right], "bytes", len(js))
