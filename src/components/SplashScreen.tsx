import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { LogoMark } from './Logo';
import { company } from '../data/company';

const DURATION_MS = 3600;
const ease = [0.22, 1, 0.36, 1] as const;
const inOut = [0.76, 0, 0.24, 1] as const;

// How the splash hands over to the site — change this one value to switch:
//   'gates'     two biscuit panels slide apart from the centre with a gold seam
//   'iris'      a circle opens outward from the logo
//   'blueprint' the skyline zooms past the viewer while the backdrop fades
type ExitStyle = 'gates' | 'iris' | 'blueprint';
const EXIT_STYLE = 'gates' as ExitStyle;

// Shared exit for the text and decoration, so it clears before the reveal
const fadeOut = { opacity: 0, filter: 'blur(6px)', transition: { duration: 0.45, ease } };

// Hyderabad-style skyline drawn in gold — ground line, then towers rising from it
const towers = [
  'M30 110V62h28v48',
  'M68 110V34h30v76',
  'M108 110V52h24v58',
  'M146 110V12h32v98M162 12V0',
  'M190 110V40h30v70',
  'M230 110V66h24v44',
  'M264 110V46h28v64',
];
const floors = 'M146 32h32M146 52h32M146 72h32M146 92h32';

// Plays on every full page load (first visit and each refresh), not on in-app navigation
export const SplashScreen = () => {
  const [visible, setVisible] = useState(true);
  const exitStyle = EXIT_STYLE;
  const skipRef = useRef<HTMLButtonElement>(null);

  // Reduced motion skips transforms, so the blueprint zoom would jump straight to 12x
  const reduceMotion = useReducedMotion();

  // Iris opens from the centre of the logo — measured at close, after web fonts have settled the layout.
  // flushSync commits the origin first: the exiting splash keeps the props from its last render.
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const logoRef = useRef<HTMLDivElement>(null);
  const close = () => {
    const r = logoRef.current?.getBoundingClientRect();
    if (r) flushSync(() => setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 }));
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(close, reduce ? 1500 : DURATION_MS);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    skipRef.current?.focus();
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Welcome to ${company.name}`}
          className="fixed inset-0 z-[100] overflow-hidden"
        >
          {exitStyle === 'gates' &&
            // Two biscuit "gates" that part from the centre, gold seam on each inner edge
            (['left', 'right'] as const).map((side) => (
              <motion.div
                key={side}
                aria-hidden="true"
                exit={{ x: side === 'left' ? '-100%' : '100%' }}
                transition={{ duration: 1, delay: 0.35, ease: inOut }}
                className={`absolute inset-y-0 w-1/2 bg-ivory ${side === 'left' ? 'left-0' : 'right-0'}`}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  exit={{ opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.35, times: [0, 0.25, 0.7, 1] }}
                  className={`absolute inset-y-0 w-px bg-gold shadow-[0_0_12px_2px_var(--color-gold)] ${side === 'left' ? 'right-0' : 'left-0'}`}
                />
              </motion.div>
            ))}

          {/* A circle whose giant biscuit shadow is the backdrop; growing it opens a hole from the logo */}
          {exitStyle === 'iris' && (
            <motion.div
              aria-hidden="true"
              initial={{ width: 0, height: 0 }}
              exit={{ width: '300vmax', height: '300vmax' }}
              transition={{ duration: 1.1, delay: 0.3, ease: inOut }}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/70"
              style={{ left: origin.x, top: origin.y, boxShadow: '0 0 0 300vmax var(--color-ivory)' }}
            />
          )}

          {exitStyle === 'blueprint' && (
            <motion.div
              aria-hidden="true"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease }}
              className="absolute inset-0 bg-ivory"
            />
          )}

          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
            {/* Faint architectural grid, as in the page headers */}
            <motion.div
              aria-hidden="true"
              exit={fadeOut}
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, var(--color-gold) 1px, transparent 1px), linear-gradient(to bottom, var(--color-gold) 1px, transparent 1px)',
                backgroundSize: '96px 96px',
                maskImage: 'radial-gradient(circle at center, black, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 70%)',
              }}
            />

            <motion.button
              ref={skipRef}
              type="button"
              onClick={close}
              exit={fadeOut}
              className="absolute top-6 right-5 rounded-full border border-navy/20 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted transition-colors hover:border-gold-deep hover:text-gold-deep sm:right-8 lg:right-12"
            >
              Skip
            </motion.button>

            <motion.div
              ref={logoRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={exitStyle === 'iris' ? { opacity: 0, scale: 1.25, transition: { duration: 0.6, ease } } : fadeOut}
              transition={{ duration: 0.8, ease }}
            >
              <LogoMark className="h-14 w-14 md:h-16 md:w-16" />
            </motion.div>

            <motion.svg
              viewBox="0 0 320 112"
              aria-hidden="true"
              className="mt-8 w-[260px] text-gold-deep sm:w-[340px] md:w-[420px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              exit={
                exitStyle === 'blueprint' && !reduceMotion
                  ? // Zoom into the skyline; thinning the stroke keeps the lines hairline as they sweep past
                    {
                      scale: 12,
                      strokeWidth: 0.12,
                      opacity: [1, 1, 0],
                      transition: { duration: 1.3, ease: [0.55, 0, 0.75, 0.2], times: [0, 0.6, 1] },
                    }
                  : fadeOut
              }
              style={{ originX: 0.5, originY: 0.6 }}
            >
              <motion.path
                d="M0 110H320"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, ease }}
              />
              {towers.map((d, i) => (
                <motion.path
                  key={d}
                  d={d}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.3 + i * 0.08, ease }}
                />
              ))}
              <motion.path
                d={floors}
                strokeOpacity={0.45}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 1.1, ease }}
              />
            </motion.svg>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={fadeOut}
              transition={{ duration: 0.7, delay: 1.1, ease }}
              className="eyebrow mt-10"
            >
              Welcome to
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={fadeOut}
              transition={{ duration: 0.9, delay: 1.25, ease }}
              className="mt-4 font-serif text-4xl text-navy sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Kakatiya <em className="text-gold-deep">Constructions</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={fadeOut}
              transition={{ duration: 0.8, delay: 1.55, ease }}
              className="mt-5 max-w-md text-base leading-relaxed text-muted md:text-lg"
            >
              Building homes and trust across {company.city} since {company.founded}.
            </motion.p>

            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={fadeOut}
              transition={{ duration: 0.8, delay: 1.85 }}
              className="mt-10 flex divide-x divide-line"
            >
              {company.stats.map((s) => (
                <div key={s.label} className="flex flex-col px-5 sm:px-8">
                  <dt className="order-last mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-gold-deep sm:text-[10px] md:text-[11px]">{s.label}</dt>
                  <dd className="font-serif text-2xl text-navy sm:text-3xl md:text-4xl">{s.value}</dd>
                </div>
              ))}
            </motion.dl>

            {/* Progress hairline — fills over the splash's lifetime */}
            <motion.span
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={fadeOut}
              transition={{ duration: DURATION_MS / 1000, ease: 'linear' }}
              className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gold"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
