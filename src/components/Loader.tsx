import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Boot screen: a macOS terminal "deploying" nivedram.online, flanked by a
 * status list (active line highlighted) and a note, with a ( 042% ) counter.
 * Click, Enter, Space or Esc skips. Calls onDone after the curtain lifts.
 */

type Kind = 'cmd' | 'out' | 'dim' | 'ok' | 'accent' | 'progress';
type Line = { kind: Kind; text: string; start: number; dur: number };

const CHAR_MS = 14;
const EXIT_MS = 950;

function buildTimeline() {
  const lines: Line[] = [];
  let t = 350;
  const cmd = (text: string) => {
    const dur = text.length * CHAR_MS;
    lines.push({ kind: 'cmd', text, start: t, dur });
    t += dur + 170;
  };
  const out = (text: string, kind: Kind = 'out', gap = 110) => {
    lines.push({ kind, text, start: t, dur: 0 });
    t += gap;
  };
  const progress = (text: string, dur: number) => {
    lines.push({ kind: 'progress', text, start: t, dur });
    t += dur + 120;
  };

  cmd('cd ~/sites/nivedram.online');
  cmd('git pull origin main');
  out('Already up to date.', 'dim');
  cmd('npm ci --silent');
  out('added 214 packages, audited 215 in 2.1s', 'dim');
  cmd('npm run build');
  out('vite v5.4.11 building for production...', 'dim', 90);
  out('✓ 37 modules transformed.', 'out', 90);
  out('dist/assets/index.js   186.63 kB │ gzip: 59.58 kB', 'dim', 90);
  out('✓ built in 269ms', 'ok');
  cmd('./deploy.sh --prod');
  progress('Uploading dist/ → edge', 720);
  out('✓ SSL certificate valid · TLS 1.3', 'ok', 100);
  out('✓ DNS nivedram.online → 200 OK', 'ok', 100);
  out('▲ Deployed  https://nivedram.online', 'accent', 260);
  return { lines, total: t };
}

const steps = [
  'RESOLVING DEPENDENCIES',
  'COMPILING REACT COMPONENTS',
  'BUNDLING 3+ YEARS OF EXPERIENCE',
  'OPTIMIZING FOR RECRUITERS',
  'PROVISIONING SSL + EDGE CDN',
  'SHIPPING TO NIVEDRAM.ONLINE',
];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export function Loader({ onDone }: { onDone: () => void }) {
  const reduce = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const { lines, total } = useMemo(buildTimeline, []);
  const [t, setT] = useState(reduce ? total : 0);
  const [exiting, setExiting] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const done = t >= total;

  // Drive the timeline with rAF.
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const el = now - t0;
      setT(el);
      if (el < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, total]);

  // Keep the newest line in view as output scrolls.
  useEffect(() => {
    const b = bodyRef.current;
    if (b) b.scrollTop = b.scrollHeight;
  });

  const exit = () => setExiting((x) => x || true);

  // Auto-enter shortly after DONE; let the user skip any time.
  useEffect(() => {
    if (!done) return;
    const id = window.setTimeout(exit, reduce ? 200 : 750);
    return () => clearTimeout(id);
  }, [done, reduce]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['Enter', ' ', 'Escape'].includes(e.key)) {
        e.preventDefault();
        exit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const id = window.setTimeout(onDone, reduce ? 0 : EXIT_MS);
    return () => clearTimeout(id);
  }, [exiting, onDone, reduce]);

  const pct = Math.round(clamp(t / total) * 100);
  const active = Math.min(steps.length - 1, Math.floor((pct / 100) * steps.length));
  const visible = lines.filter((l) => t >= l.start);
  const current = visible[visible.length - 1];

  return (
    <div className={`loader ${exiting ? 'is-exiting' : ''}`} onClick={exit} role="status" aria-live="polite" aria-label={done ? 'Site ready' : `Loading, ${pct}%`}>
      <div className="loader__grid" aria-hidden="true" />

      <ul className="loader__steps" aria-hidden="true">
        {steps.map((s, i) => (
          <li key={s} className={i === active && !done ? 'is-active' : i < active || done ? 'is-done' : ''}>
            {'// '}{s}...
          </li>
        ))}
      </ul>

      <div className="term" aria-hidden="true">
        <div className="term__bar">
          <i /><i /><i />
          <span>nived@macbook-pro: ~/sites/nivedram.online — zsh — 80×24</span>
        </div>
        <div className="term__body" ref={bodyRef}>
          <div className="term__line term__line--dim">Last login: {new Date().toDateString()} on ttys001</div>
          {visible.map((l, i) => {
            const isLast = l === current;
            if (l.kind === 'cmd') {
              const chars = Math.floor(clamp((t - l.start) / l.dur) * l.text.length);
              const typing = chars < l.text.length;
              return (
                <div key={i} className="term__line">
                  <span className="term__arrow">➜</span> <span className="term__dir">nivedram.online</span>{' '}
                  <span className="term__git">git:(<b>main</b>)</span> {l.text.slice(0, chars)}
                  {(typing || (isLast && !done)) && <span className="term__caret" />}
                </div>
              );
            }
            if (l.kind === 'progress') {
              const p = clamp((t - l.start) / l.dur);
              return (
                <div key={i} className="term__line">
                  {l.text}
                  <span className="term__meter">
                    <span style={{ width: `${Math.round(p * 25) * 4}%` }} />
                  </span>
                  {String(Math.round(p * 100)).padStart(3, ' ')}%
                </div>
              );
            }
            return (
              <div key={i} className={`term__line term__line--${l.kind}`}>
                {l.text}
              </div>
            );
          })}
          {done && (
            <div className="term__line">
              <span className="term__arrow">➜</span> <span className="term__dir">nivedram.online</span>{' '}
              <span className="term__git">git:(<b>main</b>)</span> <span className="term__caret" />
            </div>
          )}
        </div>
      </div>

      <div className="loader__note" aria-hidden="true">
        {'// '}HANG TIGHT. THE DEPLOY IS RUNNING. IT'S A FRONTEND ENGINEER'S PORTFOLIO, SO YES, IT'S OPTIMIZED...
      </div>

      <div className="loader__count" aria-hidden="true">
        <span>( {done ? 'DONE' : `${String(pct).padStart(3, '0')}%`} )</span>
        <em>{done ? 'PRESS ENTER ↵' : 'CLICK OR PRESS ENTER TO SKIP'}</em>
      </div>
    </div>
  );
}
