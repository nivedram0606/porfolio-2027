import { useEffect, useState, type CSSProperties } from 'react';
import { beyond, experience, linkedOrganizations, nav, profile, projects, skills, stats } from '../data';
import { ProjectArt } from './ProjectArt';
import { Icon, Logo, Portrait, Reveal, SplitHeading, useInView } from './ui';

/* ---------------- Nav: floating pill, icon buttons with tooltips ---------------- */
export function Nav() {
  const [active, setActive] = useState('home');
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    nav.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <nav className="nav" aria-label="Primary">
      <a href="#home" className="nav__brand">
        <Logo />
        <span>{profile.name}</span>
      </a>
      <span className="nav__divider" />
      <ul className="nav__links">
        {nav.map((n) => (
          <li key={n.id}>
            <a href={`#${n.id}`} className={active === n.id ? 'is-active' : ''} aria-label={n.label} data-tip={n.label}>
              <Icon name={n.icon} />
            </a>
          </li>
        ))}
        <li>
          <a href={profile.resume} target="_blank" rel="noreferrer" aria-label="Resume" data-tip="Resume">
            <Icon name="file" />
          </a>
        </li>
      </ul>
      <span className="nav__progress" data-progress aria-hidden="true" />
    </nav>
  );
}

/* ---------------- Hero: greeting, rotating role ticker, code-window visual ---------------- */
/* Rotates through any number of roles: slides up one line every 2.4s, then snaps back
   invisibly from the duplicated first line so the loop looks seamless. */
function useTicker(count: number, ms = 2400) {
  const [i, setI] = useState(0);
  const [animate, setAnimate] = useState(true);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      setAnimate(true);
      setI((x) => x + 1);
    }, ms);
    return () => clearInterval(id);
  }, [ms]);
  useEffect(() => {
    if (i < count) return;
    const id = window.setTimeout(() => {
      setAnimate(false);
      setI(0);
    }, 700);
    return () => clearTimeout(id);
  }, [i, count]);
  return { i, animate };
}

export function Hero() {
  const roles = [...profile.roles, profile.roles[0]];
  const { i: roleIndex, animate } = useTicker(profile.roles.length);
  return (
    <section id="home" className="hero">
      <div className="hero__grid" aria-hidden="true" data-scroll-speed="0.45" />
      <div className="hero__copy" data-scroll-speed="-0.25" data-fade-out>
        <h1 className="hero__hi">
          Hi, I'm <strong>{profile.name}</strong>
        </h1>
        <div className="ticker" aria-label={profile.roles.join(', ')}>
          <div
            className="ticker__track"
            style={{ transform: `translateY(${-1.25 * roleIndex}em)`, transition: animate ? undefined : 'none' }}
          >
            {roles.map((r, i) => (
              <span key={i} aria-hidden="true">{r}</span>
            ))}
          </div>
        </div>
        <div className="hero__cta">
          <a className="btn btn--primary" href={`mailto:${profile.email}?subject=Let's%20work%20together`}>Hire me</a>
          <a className="btn" href={profile.resume} target="_blank" rel="noreferrer">Resume</a>
        </div>
      </div>

      <div className="hero__stage" data-scroll-speed="0.18">
        <div className="code">
          <div className="code__bar">
            <i /><i /><i />
            <span>nived.tsx</span>
          </div>
          <pre className="code__body">
            <code>
              <span className="k">const</span> <span className="v">nived</span> = {'{'}{'\n'}
              {'  '}role: <span className="s">'Software Engineer'</span>,{'\n'}
              {'  '}now: <span className="s">'Clinch Solutions · Dubai (remote)'</span>,{'\n'}
              {'  '}base: <span className="s">'{profile.location}'</span>,{'\n'}
              {'  '}stack: [<span className="s">'React'</span>, <span className="s">'Next.js'</span>, <span className="s">'TypeScript'</span>, <span className="s">'Node'</span>],{'\n'}
              {'  '}shipped: [<span className="s">'KareFlow'</span>, <span className="s">'AI Photocloud'</span>, <span className="s">'RestoAp'</span>],{'\n'}
              {'  '}openToWork: <span className="k">true</span>,{'\n'}
              {'}'};<span className="caret" />
            </code>
          </pre>
        </div>
        <Portrait src={profile.photo} initials={profile.initials} className="hero__portrait" />
      </div>
      <a href="#about" className="hero__scroll" aria-label="Scroll to about">
        <span />
      </a>
    </section>
  );
}

/* ---------------- About: intro text + fanned stat cards ---------------- */
export function About() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  return (
    <section id="about" className="section about" data-enter>
      <Reveal className="about__text" speed={0.06} desktopOnly>
        <p>
          {profile.intro} <strong>{profile.introEmphasis}</strong>
        </p>
      </Reveal>
      <div ref={ref} className={`fan ${inView ? 'is-open' : ''}`} data-speed="-0.08" data-desktop>
        {stats.map((s, i) => (
          <div key={s.label} className="fan__card" style={{ '--i': i, '--n': stats.length } as CSSProperties}>
            <span className="fan__value">{s.value}</span>
            <span className="fan__label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Projects: grid of cards ---------------- */
export function Projects() {
  return (
    <section id="projects" className="section" data-enter>
      <div className="section__head">
        <SplitHeading text="Projects you need to see" />
        <Reveal delay={250}>
        <p className="lede">Complex workflows in ERP, HealthTech, AI and GovTech, made fast and usable.</p>
        <p className="note">
          Most of this is client work under NDA. Curious about the details?{' '}
          <a href={`mailto:${profile.email}?subject=Project%20walkthrough`}>Drop me a line</a> and I'll walk you through it.
        </p>
        </Reveal>
      </div>
      <div className="projects">
        {projects.filter((p) => p.featured).map((p) => (
          <Reveal key={p.title} variant="scale" className="projects__featured">
            <article className="card card--featured">
              <ProjectArt kind={p.art} hue={p.hue} />
              <div className="card__body">
                <ProjectContext p={p} />
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                {p.modules && (
                  <ul className="modules" aria-label="Modules">
                    {p.modules.map((m) => <li key={m}>{m}</li>)}
                  </ul>
                )}
                <ul className="tags">
                  {p.tags.map((t) => <li key={t}>{t}</li>)}
                </ul>
                <a className="card__link" href={`mailto:${profile.email}?subject=${encodeURIComponent(`About ${p.title}`)}`}>
                  Ask about this <Icon name="arrow" size={14} />
                </a>
              </div>
            </article>
          </Reveal>
        ))}
        {projects.filter((p) => !p.featured).map((p, i) => (
          <Reveal key={p.title} delay={(i % 3) * 110} variant="scale" speed={[0, -0.07, 0.035][i % 3]} desktopOnly>
            <article className="card">
              <ProjectArt kind={p.art} hue={p.hue} />
              <div className="card__body">
                <ProjectContext p={p} />
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <ul className="tags">
                  {p.tags.map((t) => <li key={t}>{t}</li>)}
                </ul>
                <a className="card__link" href={`mailto:${profile.email}?subject=${encodeURIComponent(`About ${p.title}`)}`}>
                  Ask about this <Icon name="arrow" size={14} />
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* "Freelance · Codenzic Innovations" with the client name linked when a URL is known.
   rel="noopener" only (no nofollow/noreferrer) so the link passes SEO value and shows up as a referral. */
function ProjectContext({ p }: { p: (typeof projects)[number] }) {
  const c = p.client;
  if (!c?.url || !p.context.includes(c.name)) return <span className="card__context">{p.context}</span>;
  const [before, after] = p.context.split(c.name);
  return (
    <span className="card__context">
      {before}
      <a href={c.url} target="_blank" rel="noopener" className="card__client">{c.name} ↗</a>
      {after}
    </span>
  );
}

/* ---------------- Journey: stacked cards that fan out into a timeline ---------------- */
export function Journey() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const [focus, setFocus] = useState<number | null>(null);
  return (
    <section id="experience" className="section" data-enter>
      <div className="section__head">
        <SplitHeading text="My Journey" />
        <Reveal delay={200}>
          <p className="lede">From a MERN internship in Kochi to shipping insurance products for a team in Dubai.</p>
        </Reveal>
      </div>
      <div ref={ref} className={`deck ${inView ? 'is-open' : ''}`} onMouseLeave={() => setFocus(null)} data-speed="-0.04" data-desktop>
        {experience.map((e, i) => (
          <article
            key={e.company}
            className={`deck__card ${focus === i ? 'is-focus' : ''}`}
            style={{ '--i': i, '--n': experience.length } as CSSProperties}
            onMouseEnter={() => setFocus(i)}
            tabIndex={0}
            onFocus={() => setFocus(i)}
          >
            <header>
              {e.url ? (
                <a className="deck__company deck__company--link" href={e.url} target="_blank" rel="noopener">
                  {e.company} <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <span className="deck__company">{e.company}</span>
              )}
              {e.current && <span className="pill-live">Now</span>}
            </header>
            <h3>{e.role}</h3>
            <span className="deck__meta">
              {e.period} · {e.place}
            </span>
            <p>{e.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Stack: floating chips over a grid ---------------- */
const chipSpots = [
  [8, 14], [24, 6], [70, 8], [86, 18], [4, 46], [90, 44], [12, 78], [30, 88],
  [66, 86], [84, 74], [40, 14], [58, 18], [20, 30], [78, 32], [22, 64], [76, 60],
];
// Each chip floats at its own depth: negative drifts up faster, positive lags behind.
const chipDepth = [-0.22, 0.12, -0.3, 0.18, -0.1, 0.26, -0.18, 0.08, -0.26, 0.15, -0.06, 0.2, -0.14, 0.1, -0.24, 0.05];
export function Stack() {
  const [ref, inView] = useInView<HTMLElement>(0.2);
  return (
    <section id="stack" ref={ref} className={`stack ${inView ? 'is-in' : ''}`} data-enter>
      <div className="stack__grid" aria-hidden="true" data-speed="0.25" data-desktop />
      <ul className="stack__chips">
        {skills.map((s, i) => {
          const [x, y] = chipSpots[i % chipSpots.length];
          return (
            <li
              key={s}
              style={{ left: `${x}%`, top: `${y}%`, '--d': `${(i % 5) * 0.7}s`, '--r': `${(i % 2 ? 1 : -1) * (3 + (i % 4))}deg`, '--i': i } as CSSProperties}
              data-speed={chipDepth[i % chipDepth.length]}
              data-desktop
            >
              <span>{s}</span>
            </li>
          );
        })}
      </ul>
      <div className="stack__center" data-speed="0.1" data-desktop>
        <span className="script">tools I ship with</span>
        <SplitHeading text="Tech Stack" className="display--xl" />
        <p className="lede">React at the core, Node underneath, and the tooling to take it to production.</p>
        <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
          See my GitHub
        </a>
      </div>
    </section>
  );
}

/* ---------------- Beyond: text + clickable stacked card deck ---------------- */
export function Beyond() {
  const [top, setTop] = useState(0);
  const order = beyond.map((_, i) => (i - top + beyond.length) % beyond.length);
  const next = () => setTop((t) => (t + 1) % beyond.length);
  return (
    <section id="beyond" className="section beyond" data-enter>
      <div className="beyond__text" data-speed="0.06" data-desktop>
        <SplitHeading text="Beyond the Code" />
        <Reveal delay={250} variant="left">
        <p className="lede">
          Where I learned, how I work, and the languages I collaborate in. Tap the cards to shuffle through.
        </p>
        </Reveal>
      </div>
      <Reveal variant="right" delay={150} speed={-0.1} desktopOnly>
      <button className="stackdeck" onClick={next} aria-label="Show next card">
        {beyond.map((b, i) => (
          <div
            key={b.title}
            className="stackdeck__card"
            style={{ '--pos': order[i], '--hue': b.hue, zIndex: beyond.length - order[i] } as CSSProperties}
            aria-hidden={order[i] !== 0}
          >
            <div className="stackdeck__art"><span>{b.kicker}</span></div>
            <h3>{b.title}</h3>
            <p>{b.body}</p>
            <span className="stackdeck__hint">
              {top + 1}/{beyond.length} · Next <Icon name="arrow" size={12} />
            </span>
          </div>
        ))}
      </button>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <Logo />
          <p>Built with React, TypeScript and a lot of filter coffee.</p>
          <p className="muted">© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          {/* Sitewide do-follow links to every company with a website (see linkedOrganizations in data.ts). */}
          <p className="muted footer__worked">
            Worked with:{' '}
            {linkedOrganizations.map((o, i) => (
              <span key={o.url}>
                {i > 0 && ' · '}
                <a href={o.url} target="_blank" rel="noopener" className="footer__partner">
                  {o.name}
                </a>
              </span>
            ))}
          </p>
        </div>
        <div className="footer__links">
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={`mailto:${profile.email}`}>Email</a>
          <a href={profile.resume} target="_blank" rel="noreferrer">Resume</a>
        </div>
      </div>
    </footer>
  );
}
