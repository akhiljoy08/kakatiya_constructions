import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt in degrees (kept small so it reads as depth, not a flip) */
  max?: number;
};

/**
 * Gently tilts its content toward the mouse pointer in 3D, with a soft light
 * sheen following the cursor. Mouse only — touch and reduced-motion users
 * get a static card.
 */
export const TiltCard = ({ children, className = '', max = 6 }: TiltCardProps) => {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 20 };
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const sheen = useTransform(
    [px, py],
    ([x, y]: number[]) => `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.22), transparent 45%)`,
  );

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
        style={{ rotateX, rotateY }}
        className={`relative h-full ${className}`}
      >
        {children}
        <motion.span
          aria-hidden="true"
          style={{ background: sheen }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </motion.div>
    </div>
  );
};
