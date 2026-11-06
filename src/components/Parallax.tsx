import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  /** How far the content drifts across the scroll, in % of its height (each way) */
  strength?: number;
};

/**
 * Makes its content (usually a photo) drift slightly slower than the page as
 * it scrolls past, for a sense of depth. The content is scaled up a little so
 * the drift never reveals an edge. Place inside an `overflow-hidden` frame.
 */
export const Parallax = ({ children, className = '', strength = 8 }: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-strength}%`, `${strength}%`]);

  return (
    <div ref={ref} className={`absolute inset-0 ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y, scale: 1 + (strength * 2.2) / 100 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
