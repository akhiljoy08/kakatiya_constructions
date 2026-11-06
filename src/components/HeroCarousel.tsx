import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useTransform, type Variants } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Pause, Phone, Play, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

/*
 * Split hero carousel (after the My Home reference): promotional copy on a
 * clean white panel on the left, the photo carousel on the right — the image
 * carries no text, so it shows at full brightness.
 *
 *  - Photo transition: the outgoing image tilts slightly and recedes into
 *    depth; the incoming one emerges with a small counter-tilt and settles.
 *    Layers are oversized inside the panel, so no edge ever shows.
 *  - Ken Burns drift while each slide is on screen.
 *  - Navigation is ignored mid-transition, so transitions never overlap.
 *  - prefers-reduced-motion: plain crossfade, no zoom, no 3D.
 */

export type HeroSlide = {
  id: string;
  image: string;
  alt: string;
  label: string;
  title: string;
  /** Second part of the headline, set in the accent colour */
  highlight?: string;
  description: string;
  /** Up to three short selling points shown with check marks */
  highlights?: string[];
  primary: { label: string; to: string };
  secondary?: { label: string; to: string };
};

type Props = {
  slides: HeroSlide[];
  /** Time each slide stays, including its transition (ms) */
  interval?: number;
  /** Small trust chips above the copy */
  badges?: string[];
  /** Trust figures shown in a card under the buttons */
  stats?: { value: string; label: string }[];
  /** Optional phone link beside the buttons */
  call?: { label: string; href: string };
  /** Optional card floated over the photo (e.g. a project spotlight) */
  aside?: React.ReactNode;
};

const TRANSITION_S = 1.4;
const glide = [0.65, 0, 0.35, 1] as const;
const settle = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, '0');

const DRIFT: [number, number][] = [
  [-2, -1.5],
  [2, -1],
  [-1.5, 1.5],
];

const layer3d: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: `${7 * dir}%`, z: 80, rotateY: -7 * dir, zIndex: 2 }),
  center: {
    opacity: 1,
    x: '0%',
    z: 0,
    rotateY: 0,
    zIndex: 2,
    transition: {
      default: { duration: TRANSITION_S, ease: glide },
      opacity: { duration: TRANSITION_S * 0.65, ease: settle },
    },
  },
  exit: (dir: number) => ({
    opacity: 1,
    x: `${-5 * dir}%`,
    z: -220,
    rotateY: 8 * dir,
    filter: 'brightness(0.75)',
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
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
  out: { opacity: 0, y: -12, transition: { duration: 0.35, ease: glide } },
};
const copyItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: settle } },
};

export const HeroCarousel = ({ slides, interval = 6000, badges, stats, call, aside }: Props) => {
  const n = slides.length;
  const reduce = useReducedMotion();
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const paused = userPaused || hovering || tabHidden;

  const progress = useMotionValue(0);
  // Scroll parallax: the photo drifts down more slowly than the page as the hero scrolls away
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const lastChange = useRef(-Infinity);
  const swipeStart = useRef<number | null>(null);

  const go = useCallback(
    (target: number, direction: number) => {
      const now = performance.now();
      if (now - lastChange.current < TRANSITION_S * 1000) return; // no overlapping transitions
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

  // Autoplay clock — drives the indicator fill, advances at 100%
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

  // Only the visible photo is in the DOM; warm the next one so it is ready
  useEffect(() => {
    const img = new Image();
    img.src = slides[(index + 1) % n].image;
  }, [index, n, slides]);

  const slide = slides[index];
  const upNext = slides[(index + 1) % n];
  const [dx, dy] = DRIFT[index % DRIFT.length];
  const hoverHandlers = { onMouseEnter: () => setHovering(true), onMouseLeave: () => setHovering(false) };

  return (
    <section
      aria-roledescription="carousel"
      ref={sectionRef}
      aria-label="Featured work"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') next();
        else if (e.key === 'ArrowLeft') prev();
      }}
      className="relative bg-paper pt-[70px] md:pt-[82px] xl:pt-[90px]"
    >
      <div className="grid lg:min-h-[calc(100svh-82px)] lg:grid-cols-12 xl:min-h-[calc(100svh-90px)]">
        {/* ---------- Photo panel (right on desktop, top on phones) ---------- */}
        <div
          {...hoverHandlers}
          onPointerDown={(e) => {
            if (e.pointerType !== 'mouse') swipeStart.current = e.clientX;
          }}
          onPointerUp={(e) => {
            if (swipeStart.current === null) return;
            const d = e.clientX - swipeStart.current;
            swipeStart.current = null;
            if (Math.abs(d) > 50) (d < 0 ? next : prev)();
          }}
          className="relative isolate aspect-[4/3] overflow-hidden bg-navy sm:aspect-[16/10] lg:order-2 lg:col-span-7 lg:aspect-auto"
        >
          <motion.div className="absolute inset-0" style={reduce ? { perspective: 1600 } : { y: photoY, perspective: 1600 }}>
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={slide.id}
              custom={dir}
              variants={reduce ? layerFade : layer3d}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute -inset-[6%] will-change-transform"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <motion.img
                src={slide.image}
                alt={slide.alt}
                decoding="async"
                fetchPriority={index === 0 ? 'high' : 'auto'}
                initial={{ scale: 1.02, x: '0%', y: '0%' }}
                animate={reduce ? undefined : { scale: 1.1, x: `${dx}%`, y: `${dy}%` }}
                transition={{ duration: (interval + TRANSITION_S * 1000) / 1000, ease: 'linear' }}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          </motion.div>

          {/* Vertical accent label on the panel's left edge, as on the reference */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-14 items-center justify-center bg-gradient-to-r from-black/35 to-transparent lg:flex">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={slide.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: settle }}
                className="flex -rotate-180 items-center gap-4 text-[11px] font-bold uppercase tracking-[0.32em] text-white [writing-mode:vertical-rl]"
              >
                <span className="h-10 w-px bg-gold" aria-hidden="true" />
                {slide.label}
              </motion.span>
            </AnimatePresence>
          </div>

          {aside && <div className="absolute right-4 bottom-4 z-10 sm:right-6 sm:bottom-6 lg:right-8 lg:bottom-8">{aside}</div>}
        </div>

        {/* ---------- Content panel ---------- */}
        <div className="relative flex flex-col justify-between gap-10 px-5 pt-9 pb-10 sm:px-8 md:pt-12 lg:order-1 lg:col-span-5 lg:pt-12 lg:pr-12 lg:pb-10 lg:pl-12 xl:pr-16 xl:pl-16 2xl:pl-24">
          <div>
            {badges && (
              <ul className="flex flex-wrap gap-2" aria-label="Credentials">
                {badges.map((b, i) => (
                  <li
                    key={b}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-navy/80"
                  >
                    {i === 0 && <ShieldCheck size={13} className="text-gold-deep" aria-hidden="true" />}
                    {b}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 lg:mt-10" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${n}`}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={slide.id} variants={copy} initial="hidden" animate="show" exit="out" aria-live={paused ? 'polite' : 'off'}>
                  <motion.p variants={copyItem} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-gold-deep">
                    <span className="font-serif text-base tracking-normal">{pad(index + 1)}</span>
                    <span className="h-px w-8 bg-gold" aria-hidden="true" />
                    {slide.label}
                  </motion.p>
                  <motion.h1 variants={copyItem} className="mt-5 text-[2.6rem] leading-[1.05] text-navy sm:text-5xl xl:text-[3.9rem]">
                    {slide.title}
                    {slide.highlight && (
                      <>
                        <br />
                        <em className="text-gold-deep">{slide.highlight}</em>
                      </>
                    )}
                  </motion.h1>
                  <motion.p variants={copyItem} className="lead mt-5 max-w-md">
                    {slide.description}
                  </motion.p>

                  {slide.highlights && (
                    <motion.ul variants={copyItem} className="mt-6 grid gap-2.5 sm:grid-cols-2">
                      {slide.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2.5 text-[14px] font-semibold text-charcoal">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep" aria-hidden="true">
                            <Check size={12} strokeWidth={3} />
                          </span>
                          {h}
                        </li>
                      ))}
                    </motion.ul>
                  )}

                  <motion.div variants={copyItem} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                    <Link to={slide.primary.to} className="btn btn-gold group shadow-[0_14px_30px_-14px_rgba(30,78,140,0.55)]">
                      {slide.primary.label}
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                    {slide.secondary && (
                      <Link to={slide.secondary.to} className="btn btn-outline-dark">
                        {slide.secondary.label}
                      </Link>
                    )}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {call && (
              <a href={call.href} className="group mt-5 inline-flex items-center gap-3 text-sm font-semibold text-navy">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory text-gold-deep transition-colors group-hover:bg-cta group-hover:text-white">
                  <Phone size={15} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Call our sales team</span>
                  {call.label}
                </span>
              </a>
            )}
          </div>

          <div>
            {stats && (
              <dl className="grid grid-cols-3 divide-x divide-line rounded-xl border border-line bg-paper shadow-[0_12px_30px_-20px_rgba(19,35,57,0.35)]">
                {stats.map((s) => (
                  <div key={s.label} className="px-4 py-4 sm:px-5">
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-serif text-2xl leading-none text-navy sm:text-3xl">{s.value}</dd>
                    <dd className="mt-2 text-[9px] font-bold uppercase tracking-[0.18em] text-muted sm:text-[10px]">{s.label}</dd>
                  </div>
                ))}
              </dl>
            )}

            {/* Controls */}
            <div {...hoverHandlers} className="mt-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <ol className="flex items-center gap-2" aria-label="Slides">
                  {slides.map((s, i) => {
                    const active = i === index;
                    return (
                      <li key={s.id}>
                        <button
                          type="button"
                          onClick={() => go(i, i > index ? 1 : -1)}
                          aria-label={`Go to slide ${i + 1}: ${s.label}`}
                          aria-current={active ? 'true' : undefined}
                          className="group flex h-8 items-center"
                        >
                          <span
                            className={`relative block h-[3px] overflow-hidden rounded-full bg-navy/15 transition-[width,background-color] duration-500 group-hover:bg-navy/30 ${
                              active ? 'w-14' : 'w-6'
                            }`}
                          >
                            {active && <motion.span className="absolute inset-0 origin-left bg-cta" style={{ scaleX: progress }} />}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                {/* Up next preview */}
                <button type="button" onClick={next} className="group hidden items-center gap-3 text-left sm:flex" aria-label={`Next slide: ${upNext.label}`}>
                  <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md">
                    <img src={upNext.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[9px] font-bold uppercase tracking-[0.22em] text-muted">Up next</span>
                    <span className="block max-w-[9rem] truncate text-[12px] font-semibold text-navy group-hover:text-gold-deep">{upNext.label}</span>
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setUserPaused((v) => !v)}
                  aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
                  className="hidden h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:text-gold-deep md:flex"
                >
                  {userPaused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
                </button>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous slide"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-navy/20 text-navy transition-colors hover:border-cta hover:bg-cta hover:text-white"
                >
                  <ArrowLeft size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next slide"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white transition-colors hover:bg-cta"
                >
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
