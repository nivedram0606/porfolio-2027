import Lenis from 'lenis';

/**
 * One rAF loop drives everything scroll-linked:
 *  - Lenis smooth scrolling (wheel), with anchor links routed through it
 *  - [data-speed]        parallax relative to the viewport centre (y = distance * speed)
 *  - [data-scroll-speed] parallax relative to page top (hero layers: y = scrollY * speed)
 *  - [data-fade-out]     fades + lifts as you scroll away from the top (hero copy)
 *  - [data-enter]        sections ease in (scale + opacity) as they rise into view
 *  - [data-progress]     scaleX = page scroll progress
 *
 * Parallax writes the CSS `translate` property and section entry writes `scale`,
 * so neither conflicts with existing `transform`-based hover/reveal animations.
 * Add `data-desktop` to a layer to disable it below 960px.
 */
type Layer = { el: HTMLElement; speed: number; base: number; desktop: boolean };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function initMotion() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return () => {};

  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.95 });

  let layers: Layer[] = [];
  let scrollLayers: Layer[] = [];
  let sections: { el: HTMLElement; top: number }[] = [];
  let fades: HTMLElement[] = [];
  let progress: HTMLElement[] = [];
  let vh = window.innerHeight;
  let wide = window.innerWidth >= 960;
  let lastY = -1;
  let raf = 0;

  const measure = () => {
    vh = window.innerHeight;
    wide = window.innerWidth >= 960;
    const all = document.querySelectorAll<HTMLElement>('[data-speed],[data-scroll-speed],[data-enter]');
    all.forEach((el) => {
      el.style.translate = '';
      el.style.scale = '';
    });
    const y = window.scrollY;
    layers = [...document.querySelectorAll<HTMLElement>('[data-speed]')].map((el) => {
      const r = el.getBoundingClientRect();
      return { el, speed: parseFloat(el.dataset.speed || '0'), base: r.top + y + r.height / 2, desktop: 'desktop' in el.dataset };
    });
    scrollLayers = [...document.querySelectorAll<HTMLElement>('[data-scroll-speed]')].map((el) => ({
      el,
      speed: parseFloat(el.dataset.scrollSpeed || '0'),
      base: 0,
      desktop: 'desktop' in el.dataset,
    }));
    sections = [...document.querySelectorAll<HTMLElement>('[data-enter]')].map((el) => ({ el, top: el.getBoundingClientRect().top + y }));
    fades = [...document.querySelectorAll<HTMLElement>('[data-fade-out]')];
    progress = [...document.querySelectorAll<HTMLElement>('[data-progress]')];
    update(y);
    lastY = y;
  };

  const update = (y: number) => {
    const mid = y + vh / 2;
    const k = wide ? 1 : 0.5;
    for (const l of layers) {
      const s = l.desktop && !wide ? 0 : l.speed * k;
      l.el.style.translate = `0 ${((l.base - mid) * s).toFixed(1)}px`;
    }
    for (const l of scrollLayers) {
      const s = l.desktop && !wide ? 0 : l.speed;
      l.el.style.translate = `0 ${(y * s).toFixed(1)}px`;
    }
    for (const sec of sections) {
      // 0 when the section's top is at the bottom of the viewport, 1 once it reaches 45% up.
      const e = easeOut(clamp((y + vh - sec.top) / (vh * 0.55)));
      sec.el.style.scale = `${(0.94 + 0.06 * e).toFixed(4)}`;
      sec.el.style.opacity = `${(0.25 + 0.75 * e).toFixed(3)}`;
    }
    const f = clamp(y / (vh * 0.7));
    for (const el of fades) {
      el.style.opacity = `${(1 - f).toFixed(3)}`;
      el.style.filter = f > 0.01 ? `blur(${(f * 6).toFixed(1)}px)` : '';
    }
    const max = document.documentElement.scrollHeight - vh;
    for (const el of progress) el.style.transform = `scaleX(${max > 0 ? clamp(y / max) : 0})`;
  };

  const loop = (time: number) => {
    lenis.raf(time);
    const y = window.scrollY;
    if (y !== lastY) {
      update(y);
      lastY = y;
    }
    raf = requestAnimationFrame(loop);
  };

  // Route in-page anchor links through Lenis so jumps glide instead of snapping.
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href')!;
    const target = id === '#' ? null : document.querySelector<HTMLElement>(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: id === '#home' ? 0 : -72, duration: 1.4 });
    history.replaceState(null, '', id);
  };

  const ro = new ResizeObserver(() => measure());
  ro.observe(document.body);
  window.addEventListener('resize', measure);
  document.addEventListener('click', onClick);
  // Fonts shift layout once loaded; re-measure then.
  document.fonts?.ready.then(measure);
  measure();
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    window.removeEventListener('resize', measure);
    document.removeEventListener('click', onClick);
    lenis.destroy();
  };
}
