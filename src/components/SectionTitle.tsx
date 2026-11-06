import React from 'react';
import { motion, type Variants } from 'motion/react';

interface SectionTitleProps {
  title: React.ReactNode;
  eyebrow?: string;
  subtitle?: string;
  light?: boolean;
  centered?: boolean;
  className?: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

// Section heading that builds itself as it scrolls in: the label slides in,
// the title rises from behind a mask, then the subtitle fades up.
// The in-view check is on the outer wrapper (never clipped) and reaches the
// parts through variants — the title starts hidden below its mask, so it
// could never be detected as "in view" on its own.
export const SectionTitle = ({ title, eyebrow, subtitle, light = false, centered = false, className = '' }: SectionTitleProps) => {
  const eyebrowVariants: Variants = {
    hidden: { opacity: 0, x: centered ? 0 : -24, y: centered ? 10 : 0 },
    shown: { opacity: 1, x: 0, y: 0, transition: { duration: 0.7, ease } },
  };
  const titleVariants: Variants = {
    hidden: { y: '105%', opacity: 0.2 },
    shown: { y: '0%', opacity: 1, transition: { duration: 1, delay: 0.1, ease } },
  };
  const subtitleVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease } },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
      className={`${centered ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}
    >
      {eyebrow && (
        <motion.p variants={eyebrowVariants} className={`eyebrow ${light ? 'eyebrow-light' : ''} mb-6`}>
          {eyebrow}
        </motion.p>
      )}
      <div className="overflow-hidden pb-[0.12em]">
        <motion.h2 variants={titleVariants} className={`display-lg ${light ? 'text-white' : 'text-navy'}`}>
          {title}
        </motion.h2>
      </div>
      {subtitle && (
        <motion.p
          variants={subtitleVariants}
          className={`mt-6 max-w-xl text-base leading-relaxed md:text-lg ${centered ? 'mx-auto' : ''} ${light ? 'text-white/65' : 'text-muted'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
};
