// Smoke test for a standalone Framer code file, with no browser: imports only react/framer, the module evaluates
// without a DOM, property controls register, and the default export server-renders on preview and canvas.
// Usage (from the repo root): node agent/skills/framer-cinematic-curtain/scripts/smoke-ssr.mjs <file.tsx> ['{"prop":1}']
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";

const file = process.argv[2] && path.resolve(process.argv[2]);
if (!file) throw new Error("Pass the standalone .tsx file");
const props = JSON.parse(process.argv[3] ?? "{}");
const root = process.cwd();
const out = path.join(root, "node_modules/.cache/framer-smoke"); // inside the repo, so react resolves
let failed = false;
const fail = (message) => {
  failed = true;
  console.error(`FAIL ${message}`);
};

const source = await readFile(file, "utf8");
const imports = [...source.matchAll(/^import[^;]*?from\s*["']([^"']+)["'];?$/gm)].map((m) => m[1]);
if (imports.some((id) => id !== "react" && id !== "framer")) fail(`imports ${imports.join(", ")} (Framer file: react and framer only)`);
else console.log(`ok   imports: ${[...new Set(imports)].join(", ")}`);

await mkdir(out, { recursive: true });
const stub = path.join(out, "framer-stub.mjs");
await writeFile(
  stub,
  [
    "export const ControlType = new Proxy({}, { get: (_, key) => String(key) });",
    'export const RenderTarget = { canvas: "CANVAS", preview: "PREVIEW", export: "EXPORT", thumbnail: "THUMBNAIL", current: () => globalThis.__RT ?? "PREVIEW" };',
    "export function addPropertyControls(component, controls) { component.propertyControls = controls; }",
  ].join("\n"),
);

process.env.NODE_ENV = "production";
await build({
  configFile: false,
  root,
  logLevel: "warn",
  mode: "production",
  publicDir: false,
  resolve: { alias: { framer: stub } },
  build: {
    write: true,
    outDir: out,
    emptyOutDir: false,
    minify: false,
    lib: { entry: file, formats: ["es"], fileName: "component" },
    rollupOptions: { external: [/^react(\/|$)/, /^react-dom(\/|$)/] },
  },
});

const { createElement } = await import("react");
const { renderToString } = await import("react-dom/server");
let mod;
try {
  mod = await import(`${pathToFileURL(path.join(out, "component.js")).href}?t=${Date.now()}`);
} catch (error) {
  fail(`module evaluation: ${error.message}`);
  process.exit(1);
}
if (typeof mod.default !== "function") fail("no default-exported component");
else console.log(`ok   controls: ${Object.keys(mod.default.propertyControls ?? {}).join(", ") || "(none)"}`);

for (const target of ["PREVIEW", "CANVAS"]) {
  globalThis.__RT = target;
  try {
    const html = renderToString(createElement(mod.default, props));
    console.log(`ok   ${target.toLowerCase()} render: ${html.length} chars`);
  } catch (error) {
    fail(`${target.toLowerCase()} render: ${error.message}`);
  }
}
process.exit(failed ? 1 : 0);
