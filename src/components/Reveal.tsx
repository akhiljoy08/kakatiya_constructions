import React from 'react';
import { motion } from 'motion/react';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'li' | 'article' | 'figure';
}

// Content "arrives" as it scrolls into view: it rises from below, tips up
// from a slight 3D angle and comes into focus. Plays once. Motion's
// reducedMotion="user" (set in App) leaves only the fade for visitors who
// prefer less motion.
export const Reveal = ({ children, className, delay = 0, as = 'div' }: RevealProps) => {
  const Component = motion[as];
  return (
    <Component
      initial={{ opacity: 0, y: 56, rotateX: 10, scale: 0.97, filter: 'blur(6px)', transformPerspective: 1200 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: '50% 100%' }}
      className={className}
    >
      {children}
    </Component>
  );
};

interface RevealImageProps {
  children: React.ReactNode;
  /** Position and size of the frame (e.g. `relative aspect-[4/5] w-full`) */
  className?: string;
  /** Look of the frame (radius, shadow, ring) — applied to the clipped layer */
  frameClassName?: string;
  delay?: number;
  /** Corner radius in px, so the unveiling edge matches the frame */
  radius?: number;
}

const unveilEase = [0.77, 0, 0.175, 1] as const;
const settleEase = [0.22, 1, 0.36, 1] as const;

// Photo "unveil": a curtain wipes upward while the photo settles from a
// slight zoom.
//
// The in-view check sits on the outer, unclipped element and is handed to
// the clipped layers through variants. (An element hidden by its own or an
// ancestor's clip-path never counts as "in view", so observing the clipped
// layer directly would leave the photo hidden forever.)
export const RevealImage = ({ children, className = '', frameClassName = '', delay = 0, radius = 16 }: RevealImageProps) => (
  <motion.div initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.2 }} className={className}>
    <motion.div
      variants={{
        hidden: { clipPath: `inset(100% 0% 0% 0% round ${radius}px)` },
        shown: {
          clipPath: `inset(0% 0% 0% 0% round ${radius}px)`,
          transition: { duration: 1.2, delay, ease: unveilEase },
          transitionEnd: { clipPath: 'none' }, // let the frame's shadow show again
        },
      }}
      className={`absolute inset-0 overflow-hidden ${frameClassName}`}
    >
      <motion.div
        variants={{ hidden: { scale: 1.25 }, shown: { scale: 1, transition: { duration: 1.8, delay, ease: settleEase } } }}
        className="absolute inset-0"
      >
        {children}
      </motion.div>
    </motion.div>
  </motion.div>
);
