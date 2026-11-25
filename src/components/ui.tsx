import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';

/** Becomes true once the element scrolls into view (and stays true). */
export function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

type RevealVariant = 'up' | 'scale' | 'left' | 'right' | 'clip';

/** Reveals its children once in view. Pass `speed` to also make it a parallax layer. */
export function Reveal({
  children,
  delay = 0,
  className = '',
  variant = 'up',
  speed,
  desktopOnly,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: RevealVariant;
  speed?: number;
  desktopOnly?: boolean;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.15);
  return (
    <div
      ref={ref}
      className={`reveal reveal--${variant} ${inView ? 'is-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      data-speed={speed}
      data-desktop={desktopOnly ? '' : undefined}
    >
      {children}
    </div>
  );
}

/** Display heading whose words slide up from behind a mask, one after another. */
export function SplitHeading({ text, className = '', as: Tag = 'h2' }: { text: string; className?: string; as?: 'h1' | 'h2' }) {
  const [ref, inView] = useInView<HTMLHeadingElement>(0.4);
  const words = text.split(' ');
  return (
    <Tag ref={ref} className={`display split ${inView ? 'is-in' : ''} ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="split__w" aria-hidden="true">
            <span className="split__i" style={{ transitionDelay: `${i * 80}ms` }}>
              {w}
            </span>
          </span>
          {/* Space lives outside the inline-block mask, where it isn't collapsed. */}
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/** Shows the portrait if public/me.jpg exists, otherwise a monogram. */
export function Portrait({ src, initials, className = '' }: { src: string; initials: string; className?: string }) {
  const [ok, setOk] = useState(true);
  return (
    <div className={`portrait ${className}`}>
      {ok ? (
        <img src={src} alt="Portrait of Nived Ram" onError={() => setOk(false)} />
      ) : (
        <div className="portrait__mono" aria-hidden="true">
          <span>{initials}</span>
        </div>
      )}
    </div>
  );
}

const paths: Record<string, ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  folder: <path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />,
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
    </>
  ),
  code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />,
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  file: (
    <>
      <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </>
  ),
  arrow: <path d="M7 17 17 7M8 7h9v9" />,
  plus: <path d="M12 5v14M5 12h14" />,
};

export function Icon({ name, size = 18 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export function Logo() {
  return (
    <span className="logo" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M6 18V6l6 9V6M14 18V6h3a3 3 0 0 1 0 6h-3l4 6" />
      </svg>
    </span>
  );
}
