import { Analytics } from '@vercel/analytics/react';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Connect } from './components/Connect';
import { Loader } from './components/Loader';
import { About, Beyond, Footer, Hero, Journey, Nav, Projects, Stack } from './components/Sections';
import { initMotion } from './motion';

export default function App() {
  // The boot loader runs on every page load (visitors can still skip it with click / Enter / Esc).
  const [booting, setBooting] = useState(true);

  // While booting, the page's own intro animations are paused (see loader.css) and scrolling is locked.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('is-booting', booting);
    if (booting) window.scrollTo(0, 0);
  }, [booting]);

  // Smooth scroll + parallax + section entry start once the loader is gone.
  useEffect(() => (booting ? undefined : initMotion()), [booting]);

  const finishBoot = useCallback(() => setBooting(false), []);

  return (
    <>
      {booting && <Loader onDone={finishBoot} />}
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Journey />
        <Stack />
        <Beyond />
        <Connect />
      </main>
      <Footer />
      {/* Vercel Web Analytics: cookieless page views + visitors. Only reports on Vercel deployments. */}
      <Analytics />
    </>
  );
}
