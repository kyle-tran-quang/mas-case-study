import { useCallback, useEffect, useRef } from "react";
// @ts-expect-error the skill runtime is plain JS with no type declarations
import { generate } from "./ui-generation.js";
import "./ui-generation.css";
import "./text-image-generation.css";
import "./MGoatQuestionnaireLoading.css";
import sidebarArt from "./assets/sidebar-art.png";

const INFO = (
  <svg viewBox="0 0 16 16" fill="none" stroke="#f4f4f4" strokeWidth="1.2" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" /><path d="M8 7v4M8 4.6v.1" />
  </svg>
);

const GROUPS = [
  { q: "What are your top strategic business objectives? (choose up to 3)", opts: ["Reduce unplanned downtime", "Reduce maintenance costs", "Improve technician productivity", "Improve MRO inventory efficiency", "Extend asset lifespan", "Reduce compliance and safety risk", "Improve production quality and yield", "Meet service level commitments", "Improve operational visibility"] },
  { q: "What are your organisation’s biggest obstacles? (select all that apply)", opts: ["We lack visibility into asset health", "Too much work is reactive", "Maintenance costs continue to rise", "We struggle to plan and schedule work effectively", "Resource availability is difficult to manage", "Critical asset failures disrupt operations", "Inventory shortages delay work execution", "Data quality is inconsistent", "We struggle to prioritise improvement initiatives"] },
];

/**
 * M-GOAT questionnaire loading (Figma 71:5863, "ver3") as a standalone component.
 * Plays the transitions.dev `skeleton` generation (dotted blueprint, then the real UI) over itself.
 *
 * Props
 *   autoPlay  play once on mount (default true)
 *   duration  ms of drawing (default 3200; keep between 1600 and 3600)
 *   onDone    called when the real UI is fully in
 *   Layout: the UI is laid out at full size and scaled to 70% (centered), so nothing is cropped; the stage background fades grey 10 -> grey 90 as the reveal completes.
 *   showReplay render the Replay button (default true)
 */
export interface MGoatQuestionnaireLoadingProps {
  autoPlay?: boolean;
  duration?: number;
  onDone?: (el: HTMLElement) => void;
  showReplay?: boolean;
}

export default function MGoatQuestionnaireLoading({ autoPlay = true, duration = 3200, onDone, showReplay = true }: MGoatQuestionnaireLoadingProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const runRef = useRef<{ cancel: () => void; finished: Promise<unknown> } | null>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const play = useCallback(async () => {
    const el = appRef.current;
    if (!el) return;
    const stage = stageRef.current;
    runRef.current?.cancel();
    await document.fonts.ready;                     // measure after fonts, or the dotted lines land in the wrong place
    if (!appRef.current || !stage) return;          // unmounted while waiting
    // Background: Carbon grey 10 -> grey 90, timed to the skill's reveal phase (0.74 to ~1.055 of `duration`)
    // so it finishes as the blueprint finishes becoming the real UI. Reset instantly first so Replay starts light.
    stage.dataset.state = "drawing";
    stage.style.transition = "none";
    void stage.offsetWidth;
    stage.style.transition = "";
    stage.style.setProperty("--mgql-bg-delay", `${Math.round(duration * 0.74)}ms`);
    stage.style.setProperty("--mgql-bg-duration", `${Math.round(duration * 0.32)}ms`);
    stage.dataset.state = "done";
    const run = generate(el, { mode: "skeleton", duration, maxParts: 70, keys: 6, done: "Questionnaire ready" });
    runRef.current = run;
    await run.finished;
    if (runRef.current === run) onDoneRef.current?.(el);
  }, [duration]);

  useEffect(() => {
    if (autoPlay) play();
    return () => runRef.current?.cancel();
  }, [autoPlay, play]);

  return (
    <>
      <div className="mgql-stage" ref={stageRef} data-state="drawing">
      <div className="mgql-app" ref={appRef}>
        <aside className="mgql-side">
          <svg className="mgql-logo" viewBox="0 0 32 32" fill="none" stroke="#78a9ff" strokeWidth="1.6" aria-hidden="true">
            <path d="M16 3l11 6v10l-11 6-11-6V9z" /><circle cx="16" cy="14" r="3" /><path d="M5 22l-2 5 5-1M27 10l2-5-5 1" />
          </svg>
          <div className="mgql-brand">
            <div><b>Maximo Application Suite</b>Growth readiness assessment</div>
            <small>beta v3</small>
          </div>
          <div className="mgql-headline"><h1>Your goals and priorities</h1><p>Page 2 of 7</p></div>
          <div className="mgql-ibm" aria-label="IBM">IBM</div>
          <div className="mgql-art" role="img" aria-label="Illustration of concentric circles and a hand selecting a flow node" style={{ backgroundImage: `url(${sidebarArt})` }} />
        </aside>

        <main className="mgql-main">
          <div className="mgql-form">
            <div className="mgql-bar" role="progressbar" aria-valuenow={29} aria-valuemin={0} aria-valuemax={100}><i /></div>
            <div className="mgql-eyebrow">Goals &amp; priorities</div>
            {GROUPS.map((g, i) => (
              <section key={g.q} className={i ? "mgql-q2" : undefined}>
                <div className="mgql-q"><h2>{g.q}</h2><span className="mgql-info">{INFO}</span></div>
                <div className="mgql-opts">
                  {g.opts.map((o) => (
                    <label className="mgql-opt" key={o}><span className="mgql-box" />{o}</label>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
      </div>
      {showReplay && <button type="button" className="mgql-replay" onClick={play} data-t-generate-skip>Replay</button>}
    </>
  );
}
