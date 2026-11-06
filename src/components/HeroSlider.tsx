import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, type Variants } from 'motion/react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

/*
 * Hero slider.
 *  - Artwork slides (`fit: 'contain'`, e.g. a banner with its own text) are
 *    never cropped or zoomed and carry no overlay.
 *  - Photo slides fill the frame with a slow Ken Burns drift and can carry
 *    copy, always bottom-left over a soft corner gradient.
 *  - One glass control bar at the bottom centre: prev · numbered progress
 *    tabs · next · pause.
 *  - 3D depth transition; navigation is ignored mid-transition.
 *  - prefers-reduced-motion: plain crossfade, no zoom, no 3D.
 */

export type HeroSlideContent = {
  label: string;
  title: string;
  /** Second line of the headline, set in the accent colour */
  highlight?: string;
  description: string;
  primary: { label: string; to: string };
  secondary?: { label: string; to: string };
};

export type HeroImageSlide = {
  id: string;
  image: string;
  alt: string;
  /** 'contain' = artwork with text (never cropped or zoomed); 'cover' = photo */
  fit?: 'contain' | 'cover';
  /** Short name used by the slide tabs */
  name: string;
  content?: HeroSlideContent;
};

type Props = {
  slides: HeroImageSlide[];
  interval?: number;
};

const TRANSITION_S = 1.3;
const glide = [0.65, 0, 0.35, 1] as const;
const settle = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, '0');

const layer3d: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: `${4 * dir}%`, z: 70, rotateY: -5 * dir, zIndex: 2 }),
  center: {
    opacity: 1,
    x: '0%',
    z: 0,
    rotateY: 0,
    zIndex: 2,
    transition: { default: { duration: TRANSITION_S, ease: glide }, opacity: { duration: TRANSITION_S * 0.6, ease: settle } },
  },
  exit: (dir: number) => ({
    opacity: 1,
    x: `${-4 * dir}%`,
    z: -200,
    rotateY: 7 * dir,
    filter: 'brightness(0.6)',
    zIndex: 1,
    transition: { duration: TRANSITION_S, ease: glide },
  }),
};
const layerFade: Variants = {
  enter: { opacity: 0, zIndex: 2 },
  center: { opacity: 1, zIndex: 2, transition: { duration: 0.8 } },
  exit: { opacity: 0, zIndex: 1, transition: { duration: 0.8 } },
};

const copy: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.45 } },
  out: { opacity: 0, y: -10, transition: { duration: 0.35, ease: glide } },
};
const line: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: settle } },
};

const DRIFT: [number, number][] = [
  [-2, -1],
  [2, -1.5],
  [-1.5, 1.5],
];

export const HeroSlider = ({ slides, interval = 6500 }: Props) => {
  const n = slides.length;
  const reduce = useReducedMotion();
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const paused = userPaused || hovering || tabHidden;

  const progress = useMotionValue(0);
  const lastChange = useRef(-Infinity);
  const swipeStart = useRef<number | null>(null);

  const go = useCallback(
    (target: number, direction: number) => {
      const now = performance.now();
      if (now - lastChange.current < TRANSITION_S * 1000) return;
      const t = ((target % n) + n) % n;
      if (t === index) return;
      lastChange.current = now;
      progress.set(0);
      setState([t, direction]);
    },
    [index, n, progress],
  );
  const next = useCallback(() => go(index + 1, 1), [go, index]);
  const prev = useCallback(() => go(index - 1, -1), [go, index]);

  const nextRef = useRef(next);
  nextRef.current = next;
  useEffect(() => {
    if (paused) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, progress.get() + (t - last) / interval);
      last = t;
      progress.set(p);
      if (p >= 1) nextRef.current();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, progress, interval]);

  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Only the visible slide is in the DOM; warm the next one
  useEffect(() => {
    const img = new Image();
    img.src = slides[(index + 1) % n].image;
  }, [index, n, slides]);

  const slide = slides[index];
  const contain = slide.fit === 'contain';
  const [dx, dy] = DRIFT[index % DRIFT.length];
  const hover = { onMouseEnter: () => setHovering(true), onMouseLeave: () => setHovering(false) };
  const roundBtn =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white hover:text-navy focus-visible:bg-white focus-visible:text-navy sm:h-11 sm:w-11';

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Highlights"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') next();
        else if (e.key === 'ArrowLeft') prev();
      }}
      onPointerDown={(e) => {
        if (e.pointerType !== 'mouse') swipeStart.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (swipeStart.current === null) return;
        const d = e.clientX - swipeStart.current;
        swipeStart.current = null;
        if (Math.abs(d) > 50) (d < 0 ? next : prev)();
      }}
      // Taller on phones so copy fits; the banner's 2:1 on desktop; never taller than the screen below the navbar
      className="relative isolate aspect-[4/5] max-h-[calc(100svh-70px)] w-full overflow-hidden bg-navy sm:aspect-[16/10] md:max-h-[calc(100svh-82px)] lg:aspect-[2/1] xl:max-h-[calc(100svh-90px)]"
      style={{ perspective: 1600 }}
    >
      {/* ---------- Image layers ---------- */}
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={slide.id}
          custom={dir}
          variants={reduce ? layerFade : layer3d}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 overflow-hidden will-change-transform"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Artwork that can't be cropped: fill any spare space with a soft blurred copy */}
          {contain && <img src={slide.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl brightness-90" />}
          <motion.img
            src={slide.image}
            alt={slide.alt}
            decoding="async"
            fetchPriority={index === 0 ? 'high' : 'auto'}
            initial={contain || reduce ? false : { scale: 1.02, x: '0%', y: '0%' }}
            animate={contain || reduce ? undefined : { scale: 1.1, x: `${dx}%`, y: `${dy}%` }}
            transition={{ duration: (interval + TRANSITION_S * 1000) / 1000, ease: 'linear' }}
            className={`relative h-full w-full ${contain ? 'object-contain' : 'object-cover'}`}
          />
          {/* Readability for copy: darken only the bottom-left corner */}
          {slide.content && (
            <>
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/55 via-60% to-transparent lg:from-navy/80 lg:via-navy/20 lg:via-40%" />
              <div aria-hidden="true" className="absolute inset-0 hidden bg-gradient-to-tr from-navy/60 via-navy/10 via-40% to-transparent lg:block" />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ---------- Copy (photo slides only), bottom-left ---------- */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-end">
        <div className="container-x pb-24 sm:pb-28 lg:pb-32">
          <AnimatePresence mode="wait" initial={false}>
            {slide.content && (
              <motion.div
                key={slide.id}
                variants={copy}
                initial="hidden"
                animate="show"
                exit="out"
                className="pointer-events-auto max-w-xl"
                {...hover}
              >
                <motion.p variants={line} className="eyebrow eyebrow-light [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
                  {slide.content.label}
                </motion.p>
                <motion.h2
                  variants={line}
                  className="mt-4 text-[2.1rem] leading-[1.05] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-[3.6rem]"
                >
                  {slide.content.title}
                  {slide.content.highlight && (
                    <>
                      <br />
                      <em className="text-gold">{slide.content.highlight}</em>
                    </>
                  )}
                </motion.h2>
                <motion.p variants={line} className="mt-4 hidden max-w-md text-base leading-relaxed text-white/85 sm:block md:text-lg">
                  {slide.content.description}
                </motion.p>
                <motion.div variants={line} className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
                  <Link to={slide.content.primary.to} className="btn btn-light group px-5 py-3 sm:px-7 sm:py-4">
                    {slide.content.primary.label}
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                  {slide.content.secondary && (
                    <Link
                      to={slide.content.secondary.to}
                      className="btn border-white/40 bg-white/10 px-5 py-3 text-white backdrop-blur-md hover:bg-white/20 sm:px-7 sm:py-4"
                    >
                      {slide.content.secondary.label}
                    </Link>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ---------- Glass control bar, bottom centre ---------- */}
      <div
        {...hover}
        className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full bg-navy/35 p-1 ring-1 ring-white/20 backdrop-blur-xl sm:bottom-6 sm:gap-2 sm:p-1.5"
      >
        <button type="button" onClick={prev} aria-label="Previous slide" className={roundBtn}>
          <ArrowLeft size={16} aria-hidden="true" />
        </button>

        <ol className="flex items-center gap-1 px-1 sm:gap-2 sm:px-2" aria-label="Slides">
          {slides.map((s, i) => {
            const active = i === index;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => go(i, i > index ? 1 : -1)}
                  aria-label={`Go to slide ${i + 1}: ${s.name}`}
                  aria-current={active ? 'true' : undefined}
                  className={`group flex flex-col items-start gap-1.5 rounded-full px-2 py-1.5 transition-colors sm:px-4 ${active ? 'text-white' : 'text-white/55 hover:text-white'}`}
                >
                  <span className="flex items-baseline gap-2 text-[11px] font-bold tracking-[0.16em] lg:text-[12px]">
                    <span className="font-serif text-sm tracking-normal lg:text-base">{pad(i + 1)}</span>
                    <span className="hidden uppercase md:inline">{s.name}</span>
                  </span>
                  <span className="relative block h-[2px] w-full min-w-6 overflow-hidden rounded-full bg-white/25">
                    {active && <motion.span className="absolute inset-0 origin-left bg-white" style={{ scaleX: progress }} />}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <button type="button" onClick={next} aria-label="Next slide" className={roundBtn}>
          <ArrowRight size={16} aria-hidden="true" />
        </button>
        <span aria-hidden="true" className="mx-0.5 hidden h-5 w-px bg-white/25 sm:block" />
        <button
          type="button"
          onClick={() => setUserPaused((v) => !v)}
          aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
          className={`${roundBtn} hidden sm:flex`}
        >
          {userPaused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
};
