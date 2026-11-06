import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/*
 * Inertia ("buttery") scrolling for the whole site via Lenis.
 * The page still scrolls natively underneath, so scroll-linked animations
 * (motion's useScroll, parallax) keep working. Disabled for visitors who
 * prefer reduced motion and on touch devices, which already have native
 * momentum scrolling.
 */

let lenis: Lenis | null = null;

/** Scroll helper that goes through Lenis when it is running. */
export const scrollToTop = (smooth = true) => {
  if (lenis) lenis.scrollTo(0, { immediate: !smooth });
  else window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
};

/** Pause / resume smooth scrolling (e.g. while a menu locks the page). */
export const setScrollLocked = (locked: boolean) => {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
};

export const SmoothScroll = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis?.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // New page starts at the top
  useEffect(() => {
    scrollToTop(false);
  }, [pathname]);

  return null;
};
