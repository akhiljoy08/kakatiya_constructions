import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { Check, Compass, Ruler } from 'lucide-react';
import { floorPlans, planArea, type Door, type FloorPlan as Plan, type Opening, type Room } from '../data/floorPlans';

/*
 * Interactive blueprint-style floor plan.
 * Walls draw themselves when the plan scrolls into view, then furniture and
 * labels fade in. Hovering, focusing or tapping a room highlights it and
 * lists its provisions. A room list beside the drawing makes it usable by
 * keyboard and on small screens.
 */

const S = 10; // px per foot
const M = 40; // margin around the plan for dimension lines
const BG = '#0F2746';
const INK = '#DCEBFA';
const SOFT = 'rgba(220,235,250,0.55)';
const ACCENT = '#8BB8E8';

const ft = (v: number) => v * S;
const fmt = (v: number) => `${Math.floor(v)}'${v % 1 ? Math.round((v % 1) * 12) : 0}"`;

/* ---------- Furniture symbols, drawn in feet inside a room ---------- */
const Furniture = ({ r }: { r: Room }) => {
  const { x, y, w, h } = r;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const p = { fill: 'none', stroke: SOFT, strokeWidth: 1 } as const;
  const rr = (rx: number, ry: number, rw: number, rh: number, k: number | string = 0, extra = {}) => (
    <rect key={`${k}-${rx}-${ry}`} x={ft(rx)} y={ft(ry)} width={ft(rw)} height={ft(rh)} rx={2} {...p} {...extra} />
  );

  switch (r.kind) {
    case 'bedroom': {
      const bx = cx - 3;
      const by = y + 1.2;
      return (
        <g>
          {rr(bx, by, 6, 6.6, 'bed')}
          {rr(bx + 0.4, by + 0.4, 2.4, 1.1, 'p1')}
          {rr(bx + 3.2, by + 0.4, 2.4, 1.1, 'p2')}
          <line x1={ft(bx)} y1={ft(by + 2.2)} x2={ft(bx + 6)} y2={ft(by + 2.2)} {...p} />
          {rr(bx - 1.8, by + 0.2, 1.4, 1.4, 'n1')}
          {rr(bx + 6.4, by + 0.2, 1.4, 1.4, 'n2')}
        </g>
      );
    }
    case 'living':
      return (
        <g>
          {rr(cx - 4, y + 0.5, 8, 1.1, 'tv')}
          {rr(cx - 5.5, y + h - 4.4, 11, 3, 'sofa')}
          <line x1={ft(cx - 5.5)} y1={ft(y + h - 2.2)} x2={ft(cx + 5.5)} y2={ft(y + h - 2.2)} {...p} />
          {rr(cx - 2.6, y + h - 8.4, 5.2, 2.6, 'table', { rx: 6 })}
          {rr(x + 1.4, cy - 1.6, 3, 3.2, 'chair')}
          <ellipse cx={ft(cx)} cy={ft(y + h - 6.6)} rx={ft(6.5)} ry={ft(3.6)} {...p} strokeDasharray="3 4" />
        </g>
      );
    case 'dining':
      return (
        <g>
          {rr(cx - 3, cy - 1.8, 6, 3.6, 'table', { rx: 8 })}
          {[-2, 0, 2].map((dx) => (
            <g key={dx}>
              {rr(cx + dx - 0.7, cy - 3.2, 1.4, 1.1, `t${dx}`)}
              {rr(cx + dx - 0.7, cy + 2.1, 1.4, 1.1, `b${dx}`)}
            </g>
          ))}
        </g>
      );
    case 'kitchen':
      return (
        <g>
          {rr(x + 0.2, y + 0.2, w - 0.4, 2.2, 'top')}
          {rr(x + 0.2, y + 2.4, 2.2, h - 5, 'side')}
          {[0, 1].map((i) =>
            [0, 1].map((j) => <circle key={`${i}${j}`} cx={ft(x + w - 3.6 + i * 1.4)} cy={ft(y + 0.8 + j * 1)} r={ft(0.38)} {...p} />),
          )}
          {rr(x + 0.5, cy - 1.6, 1.6, 3, 'sink')}
          <circle cx={ft(x + 1.3)} cy={ft(cy)} r={ft(0.45)} {...p} />
          {rr(x + w - 2.8, y + h - 2.8, 2.5, 2.5, 'fridge')}
          <line x1={ft(x + w - 2.8)} y1={ft(y + h - 0.3)} x2={ft(x + w - 0.3)} y2={ft(y + h - 2.8)} {...p} />
        </g>
      );
    case 'toilet':
      return (
        <g>
          {rr(x + w - 2.2, y + 0.3, 1.6, 0.7, 'tank')}
          <ellipse cx={ft(x + w - 1.4)} cy={ft(y + 1.9)} rx={ft(0.65)} ry={ft(0.9)} {...p} />
          <ellipse cx={ft(x + 1.3)} cy={ft(y + 0.9)} rx={ft(0.8)} ry={ft(0.55)} {...p} />
          {rr(x + w - 3, y + h - 3, 2.7, 2.7, 'shower')}
          <line x1={ft(x + w - 3)} y1={ft(y + h - 3)} x2={ft(x + w - 0.3)} y2={ft(y + h - 0.3)} {...p} />
          <line x1={ft(x + w - 0.3)} y1={ft(y + h - 3)} x2={ft(x + w - 3)} y2={ft(y + h - 0.3)} {...p} />
        </g>
      );
    case 'wardrobe':
      return (
        <g>
          {rr(x + w - 2, y + 0.3, 1.7, h - 0.6, 'w1')}
          {Array.from({ length: Math.floor((h - 0.6) / 1.5) }, (_, i) => (
            <line key={i} x1={ft(x + w - 2)} y1={ft(y + 0.3 + (i + 1) * 1.5)} x2={ft(x + w - 0.3)} y2={ft(y + 0.3 + (i + 1) * 1.5)} {...p} />
          ))}
        </g>
      );
    case 'balcony':
      return (
        <g>
          {Array.from({ length: Math.max(2, Math.floor(w / 5)) }, (_, i) => (
            <circle key={i} cx={ft(x + 2 + i * 5)} cy={ft(y + h - 1.4)} r={ft(0.8)} {...p} />
          ))}
          <circle cx={ft(cx - 1.6)} cy={ft(cy - 0.6)} r={ft(0.8)} {...p} />
          <circle cx={ft(cx + 1.6)} cy={ft(cy - 0.6)} r={ft(0.8)} {...p} />
          <circle cx={ft(cx)} cy={ft(cy - 0.6)} r={ft(0.5)} {...p} />
        </g>
      );
    case 'utility':
      return (
        <g>
          {rr(x + w - 2.8, y + 0.4, 2.4, 2.4, 'wm')}
          <circle cx={ft(x + w - 1.6)} cy={ft(y + 1.6)} r={ft(0.8)} {...p} />
          {rr(x + 0.4, y + h - 2, 2.4, 1.6, 'wash')}
        </g>
      );
    case 'foyer':
      return (
        <g>
          {rr(x + w - 6, y + 0.4, 5.2, 1.4, 'shoe')}
          {rr(cx - 3, cy - 1.5, 6, 3, 'rug', { strokeDasharray: '3 4' })}
        </g>
      );
    case 'study':
      return (
        <g>
          {rr(cx - 3.5, y + h - 2.8, 7, 2.2, 'desk')}
          <circle cx={ft(cx)} cy={ft(y + h - 4.1)} r={ft(0.9)} {...p} />
          {rr(x + w - 1.6, y + 1, 1.2, h - 4.4, 'shelf')}
        </g>
      );
    default:
      return null;
  }
};

/* ---------- Openings and doors (cut the wall, then draw the symbol) ---------- */
const Cut = ({ x, y, len, o }: { x: number; y: number; len: number; o: 'h' | 'v' }) =>
  o === 'h' ? (
    <line x1={ft(x)} y1={ft(y)} x2={ft(x + len)} y2={ft(y)} stroke={BG} strokeWidth={7} />
  ) : (
    <line x1={ft(x)} y1={ft(y)} x2={ft(x)} y2={ft(y + len)} stroke={BG} strokeWidth={7} />
  );

const OpeningMark = ({ op }: { op: Opening }) => {
  const { x, y, len, o, type } = op;
  const along = (d: number) =>
    o === 'h'
      ? { x1: ft(x), y1: ft(y) + d, x2: ft(x + len), y2: ft(y) + d }
      : { x1: ft(x) + d, y1: ft(y), x2: ft(x) + d, y2: ft(y + len) };
  return (
    <g>
      <Cut x={x} y={y} len={len} o={o} />
      {type === 'window' && (
        <>
          <line {...along(-2.5)} stroke={INK} strokeWidth={1} />
          <line {...along(0)} stroke={INK} strokeWidth={1} />
          <line {...along(2.5)} stroke={INK} strokeWidth={1} />
        </>
      )}
      {type === 'sliding' && (
        <>
          <line {...along(-1.5)} stroke={INK} strokeWidth={1.4} />
          <line {...along(1.5)} stroke={INK} strokeWidth={1.4} />
        </>
      )}
    </g>
  );
};

const DoorMark = ({ d }: { d: Door }) => {
  const { x, y, len, o, open } = d;
  const L = ft(len);
  const hx = ft(x);
  const hy = ft(y);
  let leaf: [number, number];
  let arc: string;
  if (o === 'h') {
    const dir = open === 'up' ? -1 : 1;
    leaf = [hx, hy + dir * L];
    arc = `M ${hx + L} ${hy} A ${L} ${L} 0 0 ${dir === -1 ? 0 : 1} ${hx} ${hy + dir * L}`;
  } else {
    const dir = open === 'left' ? -1 : 1;
    leaf = [hx + dir * L, hy];
    arc = `M ${hx} ${hy + L} A ${L} ${L} 0 0 ${dir === -1 ? 1 : 0} ${hx + dir * L} ${hy}`;
  }
  return (
    <g>
      <Cut x={x} y={y} len={len} o={o} />
      <line x1={hx} y1={hy} x2={leaf[0]} y2={leaf[1]} stroke={INK} strokeWidth={1.6} />
      <path d={arc} fill="none" stroke={SOFT} strokeWidth={1} strokeDasharray="3 3" />
    </g>
  );
};

/* ---------- Drawing ---------- */
const Drawing = ({ plan, active, setActive }: { plan: Plan; active: string | null; setActive: (id: string | null) => void }) => {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const W = ft(plan.width);
  const H = ft(plan.height);
  const ent = plan.entrance;

  return (
    <svg
      ref={ref}
      viewBox={`${-M} ${-M} ${W + M * 2} ${H + M * 2}`}
      className="h-auto w-full select-none"
      role="group"
      aria-label={`${plan.label} indicative floor plan`}
    >
      <defs>
        <pattern id={`grid-${plan.id}`} width={S} height={S} patternUnits="userSpaceOnUse">
          <path d={`M ${S} 0 L 0 0 0 ${S}`} fill="none" stroke="rgba(139,184,232,0.07)" strokeWidth={1} />
        </pattern>
      </defs>
      <rect x={-M} y={-M} width={W + M * 2} height={H + M * 2} fill={`url(#grid-${plan.id})`} />

      {/* Room hit-areas + highlight */}
      {plan.rooms.map((r) => (
        <rect
          key={`hit-${r.id}`}
          x={ft(r.x)}
          y={ft(r.y)}
          width={ft(r.w)}
          height={ft(r.h)}
          fill={active === r.id ? 'rgba(139,184,232,0.2)' : 'rgba(139,184,232,0)'}
          style={{ transition: 'fill 300ms ease', cursor: 'pointer' }}
          onMouseEnter={() => setActive(r.id)}
          onClick={() => setActive(r.id)}
        />
      ))}

      {/* Walls draw themselves */}
      {plan.rooms.map((r, i) => (
        <motion.rect
          key={`wall-${r.id}`}
          x={ft(r.x)}
          y={ft(r.y)}
          width={ft(r.w)}
          height={ft(r.h)}
          fill="none"
          stroke={active === r.id ? ACCENT : INK}
          strokeWidth={active === r.id ? 3 : 2.2}
          pointerEvents="none"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.4, delay: i * 0.06, ease: [0.65, 0, 0.35, 1] }}
        />
      ))}
      <motion.rect
        x={0}
        y={0}
        width={W}
        height={H}
        fill="none"
        stroke={INK}
        strokeWidth={5}
        pointerEvents="none"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : undefined}
        transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
      />

      {/* Openings, doors, furniture, labels */}
      <motion.g
        pointerEvents="none"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ duration: 0.8, delay: 1.3 }}
      >
        {plan.openings.map((op, i) => (
          <OpeningMark key={`op-${i}`} op={op} />
        ))}
        {plan.doors.map((d, i) => (
          <DoorMark key={`door-${i}`} d={d} />
        ))}
        {plan.rooms.map((r) => (
          <Furniture key={`f-${r.id}`} r={r} />
        ))}
      </motion.g>

      <motion.g
        pointerEvents="none"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ duration: 0.8, delay: 1.7 }}
        fontFamily="Manrope, sans-serif"
      >
        {plan.rooms.map((r) => {
          const small = r.w * r.h < 70;
          const ly = ft(r.y + r.h / 2 + (r.kind === 'bedroom' ? 2.4 : r.kind === 'living' ? -1 : 0));
          return (
            <g key={`l-${r.id}`} textAnchor="middle">
              <text x={ft(r.x + r.w / 2)} y={ly} fill={active === r.id ? '#FFFFFF' : INK} fontSize={small ? 7.5 : 10} fontWeight={700} letterSpacing={1.2}>
                {r.name.toUpperCase()}
              </text>
              <text x={ft(r.x + r.w / 2)} y={ly + (small ? 10 : 13)} fill={SOFT} fontSize={small ? 7 : 8.5}>
                {fmt(r.w)} × {fmt(r.h)}
              </text>
            </g>
          );
        })}

        {/* Overall dimensions */}
        <g stroke={SOFT} strokeWidth={1}>
          <line x1={0} y1={-22} x2={W} y2={-22} />
          <line x1={0} y1={-28} x2={0} y2={-16} />
          <line x1={W} y1={-28} x2={W} y2={-16} />
          <line x1={-22} y1={0} x2={-22} y2={H} />
          <line x1={-28} y1={0} x2={-16} y2={0} />
          <line x1={-28} y1={H} x2={-16} y2={H} />
        </g>
        <text x={W / 2} y={-27} textAnchor="middle" fill={INK} fontSize={9} fontWeight={600}>
          {fmt(plan.width)}
        </text>
        <text x={-27} y={H / 2} textAnchor="middle" fill={INK} fontSize={9} fontWeight={600} transform={`rotate(-90 ${-27} ${H / 2})`}>
          {fmt(plan.height)}
        </text>

        {/* Entrance */}
        <g transform={`translate(${ft(ent.x)} ${ft(ent.y)})`}>
          <path d="M 26 0 L 8 0 M 14 -5 L 8 0 L 14 5" stroke={ACCENT} strokeWidth={2} fill="none" />
          <text x={17} y={-9} textAnchor="middle" fill={ACCENT} fontSize={8} fontWeight={700} letterSpacing={1}>
            ENTRY
          </text>
        </g>

        {/* North */}
        <g transform={`translate(${W + 20} ${-20})`}>
          <circle r={10} fill="none" stroke={SOFT} />
          <path d="M 0 -7 L 4 5 L 0 2 L -4 5 Z" fill={INK} />
          <text y={-14} textAnchor="middle" fill={INK} fontSize={8} fontWeight={700}>
            N
          </text>
        </g>
      </motion.g>
    </svg>
  );
};

/* ---------- Section ---------- */
export const FloorPlan = () => {
  const [planId, setPlanId] = useState(floorPlans[0].id);
  const plan = floorPlans.find((p) => p.id === planId)!;
  const [active, setActive] = useState<string | null>(null);
  const activeRoom = useMemo(() => plan.rooms.find((r) => r.id === active) ?? null, [plan, active]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
      {/* Blueprint */}
      <div className="relative overflow-hidden rounded-3xl p-3 shadow-[0_40px_80px_-40px_rgba(15,39,70,0.7)] sm:p-6" style={{ background: BG }}>
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-1 pb-3">
          <div role="tablist" aria-label="Unit configuration" className="inline-flex rounded-full bg-white/[0.06] p-1 ring-1 ring-white/10">
            {floorPlans.map((p) => {
              const on = p.id === planId;
              return (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => {
                    setPlanId(p.id);
                    setActive(null);
                  }}
                  className={`relative rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors ${on ? 'text-navy' : 'text-white/70 hover:text-white'}`}
                >
                  {on && <motion.span layoutId="plan-tab" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                  <span className="relative">{p.label}</span>
                </button>
              );
            })}
          </div>
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-white/60">
            <Ruler size={13} aria-hidden="true" />
            Approx. {planArea(plan).toLocaleString('en-IN')} sq.ft · indicative
          </span>
        </div>

        <div onMouseLeave={() => setActive(null)}>
          <AnimatePresence mode="wait">
            <motion.div key={plan.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Drawing plan={plan} active={active} setActive={setActive} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Details panel */}
      <div className="flex flex-col gap-5">
        {/* Fixed minimum height (fits the longest room) so the room list below never shifts while hovering — a moving list made rooms flicker */}
        <div className="min-h-[18rem] rounded-3xl bg-paper p-6 shadow-[0_2px_6px_rgba(19,35,57,0.05),0_18px_40px_-26px_rgba(19,35,57,0.35)] ring-1 ring-line" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRoom?.id ?? 'summary'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {activeRoom ? (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold-deep">Room details</p>
                  <h3 className="mt-2 text-2xl text-navy">{activeRoom.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-muted">
                    {fmt(activeRoom.w)} × {fmt(activeRoom.h)} · approx. {activeRoom.w * activeRoom.h} sq.ft
                  </p>
                  <ul className="mt-5 grid gap-2.5">
                    {activeRoom.provisions.map((pr) => (
                      <li key={pr} className="flex items-start gap-2.5 text-[14px] text-charcoal">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-deep/10 text-gold-deep" aria-hidden="true">
                          <Check size={12} strokeWidth={3} />
                        </span>
                        {pr}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold-deep">Explore the layout</p>
                  <h3 className="mt-2 text-2xl text-navy">{plan.label}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">
                    Hover over or tap any room on the plan, or pick one below, to see its size and the provisions included.
                  </p>
                  <p className="mt-4 inline-flex items-center gap-2 text-[12px] font-semibold text-navy">
                    <Compass size={14} className="text-gold-deep" aria-hidden="true" />
                    East-facing entrance · {plan.rooms.length} spaces
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <ul className="grid grid-cols-2 gap-2" aria-label="Rooms">
          {plan.rooms.map((r) => {
            const on = active === r.id;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(r.id)}
                  onFocus={() => setActive(r.id)}
                  onClick={() => setActive(r.id)}
                  aria-pressed={on}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-[12px] font-semibold ring-1 transition-colors ${
                    on ? 'bg-cta text-white ring-cta' : 'bg-paper text-navy ring-line hover:ring-gold-deep/40'
                  }`}
                >
                  <span className="truncate">{r.name}</span>
                  <span className={`shrink-0 text-[10px] ${on ? 'text-white/75' : 'text-muted'}`}>{r.w * r.h}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="text-[12px] leading-relaxed text-muted">
          Indicative layout for illustration only. Room sizes, furniture and provisions vary by unit — actual approved plans are shared on request.
        </p>
      </div>
    </div>
  );
};
