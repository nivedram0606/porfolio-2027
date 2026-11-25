import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { aiAgents, experience, faqs, profile } from '../data';
import { Portrait, useInView } from './ui';

/* Heading: letters swell like a magnifier lens under the cursor (scaleX up to 1.19, Gaussian falloff ~2 chars). */
function LensHeading({ text, show }: { text: string; show: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [scales, setScales] = useState<number[]>(() => text.split('').map(() => 0));

  const onMove = (e: React.MouseEvent) => {
    const spans = ref.current?.querySelectorAll<HTMLSpanElement>('span');
    if (!spans) return;
    const next: number[] = [];
    spans.forEach((s) => {
      const r = s.getBoundingClientRect();
      const d = (e.clientX - (r.left + r.width / 2)) / r.width;
      next.push(Math.exp(-(d * d) / 1.83));
    });
    setScales(next);
  };

  return (
    <h2
      ref={ref}
      className={`display lens ${show ? 'is-in' : ''}`}
      aria-label={text}
      onMouseMove={onMove}
      onMouseLeave={() => setScales(scales.map(() => 0))}
    >
      {/* Letters are grouped per word so lines only wrap between words. */}
      {text.split(' ').map((word, w, words) => {
        const offset = words.slice(0, w).reduce((n, x) => n + x.length + 1, 0);
        return (
          <em key={w} className="lens__word" aria-hidden="true">
            {word.split('').map((ch, j) => {
              const s = scales[offset + j] ?? 0;
              return (
                <span key={j} style={{ transform: `scale(${1 + 0.19 * s}, ${1 - 0.048 * s})`, '--k': offset + j } as CSSProperties}>
                  {ch}
                </span>
              );
            })}
            {w < words.length - 1 && <span className="lens__gap"> </span>}
          </em>
        );
      })}
    </h2>
  );
}

/* Paragraph: words fade up one after another once the section is in view. */
function WordReveal({ text, show }: { text: string; show: boolean }) {
  return (
    <p className={`lede words ${show ? 'is-in' : ''}`}>
      {text.split(' ').map((w, i) => (
        <span key={i} style={{ transitionDelay: `${i * 30}ms` }}>
          {w}{' '}
        </span>
      ))}
    </p>
  );
}

const Sparkle = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" fill="currentColor" />
  </svg>
);

/* Outline pill: tilts + grows, lifts off an outlined shadow, shine streaks sweep, sparkles burst. */
function ShineButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="shine" href={href} target="_blank" rel="noreferrer">
      <span className="shine__shadow" aria-hidden="true" />
      <span className="shine__base">
        <span className="shine__streak" aria-hidden="true" />
        <span className="shine__streak shine__streak--2" aria-hidden="true" />
        <span className="shine__label">{children}</span>
      </span>
      <span className="shine__stars" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <i key={i} style={{ '--s': i } as CSSProperties}>
            <Sparkle />
          </i>
        ))}
      </span>
    </a>
  );
}

/* Primary pill with a social-proof popover: title rises, avatars pop in staggered. */
function ProofButton() {
  const teams = [...experience].reverse();
  const hues = ['#2f7bff', '#ff8a3d', '#18c29c', '#9967ff', '#ff4f7b'];
  return (
    <a className="proof" href={`mailto:${profile.email}?subject=Let's%20talk`}>
      <span className="proof__tip" role="tooltip">
        <span className="proof__title">Shipped with {teams.length} teams</span>
        <span className="proof__faces">
          {teams.map((t, i) => (
            <span key={t.company} title={t.company} style={{ '--i': i, background: hues[i % hues.length] } as CSSProperties}>
              {t.company.replace(/[^A-Za-z]/g, '').slice(0, 2)}
            </span>
          ))}
        </span>
      </span>
      <span className="proof__label">Email me</span>
    </a>
  );
}

/* FAQ as a chat thread: grey question, blue answer bubble with a tail that springs in. */
function ChatFaq() {
  const [ref, inView] = useInView<HTMLDivElement>(0.2);
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <div ref={ref} className={`chat ${inView ? 'is-in' : ''}`}>
      {faqs.map((f, i) => {
        const isOpen = open.has(i);
        return (
          <div key={f.q} className={`chat__item ${isOpen ? 'is-open' : ''}`} style={{ '--i': i } as CSSProperties}>
            <button className="chat__q" onClick={() => toggle(i)} aria-expanded={isOpen} aria-controls={`faq-${i}`}>
              <span className="chat__bubble">
                {f.q}
                {i === 0 && <Heart />}
                {i === faqs.length - 1 && <Star />}
              </span>
              <span className="chat__icon" aria-hidden="true">
                <svg viewBox="0 0 12 12" width="10" height="10">
                  <path d="M2 6h8" />
                  <path className="chat__vbar" d="M6 2v8" />
                </svg>
              </span>
            </button>
            <div className="chat__a" id={`faq-${i}`} role="region" aria-hidden={!isOpen}>
              <div className="chat__a-inner">
                <p className="chat__answer">
                  {f.a}
                  <svg className="chat__ear" viewBox="0 0 17 25" aria-hidden="true">
                    <path d="M0 0c0 12 4 20 17 25C7 25 2 22 0 18Z" />
                  </svg>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const Heart = () => (
  <svg className="sticker sticker--heart" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 5.3 3.2 1.7-2 3.2-3.2 5.3-3.2 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21Z" />
  </svg>
);
const Star = () => (
  <svg className="sticker sticker--star" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m12 2.5 2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2l-5.9 3.2 1.3-6.5-4.9-4.6 6.6-.8z" />
  </svg>
);

/* Portrait: 3D swing (rotateY 180 -> 0) that pulls the AI coding agents behind the work forward in depth.
   "What backs me": Claude, Codex, Antigravity, Kiro, Cursor (see aiAgents in data.ts). */
// Scatter positions (% of stage) and depths, adapted from the reference's hovered state.
const collage = [
  { x: -4, y: -21, z: 80 },
  { x: -27, y: 20, z: 50 },
  { x: -8, y: 66, z: 90 },
  { x: 62, y: -10, z: 100 },
  { x: 72, y: 48, z: 130 },
];
function FlipPortrait() {
  const [revealed, setRevealed] = useState(false);
  const [touch, setTouch] = useState(false);
  useEffect(() => setTouch(window.matchMedia('(hover: none)').matches), []);
  return (
    <div className="flip" data-speed="-0.08" data-desktop>
      <button
        className={`flip__stage ${revealed ? 'is-revealed' : ''}`}
        onMouseEnter={() => !touch && setRevealed(true)}
        onMouseLeave={() => !touch && setRevealed(false)}
        onClick={() => touch && setRevealed((v) => !v)}
        aria-pressed={revealed}
        aria-label={`Show the AI coding agents that back my work: ${aiAgents.map((a) => a.name).join(', ')}`}
      >
        <span className="flip__space">
          {aiAgents.slice(0, collage.length).map((a, i) => (
            <span
              key={a.name}
              className="flip__card flip__card--agent"
              style={{ '--x': `${collage[i].x}%`, '--y': `${collage[i].y}%`, '--z': `${collage[i].z}px`, '--hue': a.hue } as CSSProperties}
            >
              <small>AI agent</small>
              <b>{a.name}</b>
              <em>{a.maker}</em>
            </span>
          ))}
          <span className="flip__main">
            <Portrait src={profile.contactPhoto} initials={profile.initials} className="connect__portrait" />
          </span>
        </span>
      </button>
      <span className="flip__hint" aria-hidden="true">{touch ? 'Tap to see what backs me' : 'Hover to see what backs me'}</span>
    </div>
  );
}

export function Connect() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const lede =
    "No recruiter maze, just open channels. Whether it's a frontend role, a freelance build or a React question, I'm always up for a chat.";
  const wordCount = lede.split(' ').length;
  return (
    <section id="connect" className="section connect" data-enter>
      <div ref={ref} className="section__head">
        <LensHeading text="Start a Conversation" show={inView} />
        <WordReveal text={lede} show={inView} />
        <div className={`connect__channels ${inView ? 'is-in' : ''}`} style={{ transitionDelay: `${wordCount * 30 + 150}ms` }}>
          <ShineButton href={profile.linkedin}>LinkedIn</ShineButton>
          <ShineButton href={profile.github}>GitHub</ShineButton>
          <ProofButton />
        </div>
      </div>
      <div className="connect__body">
        <ChatFaq />
        <FlipPortrait />
      </div>
    </section>
  );
}
