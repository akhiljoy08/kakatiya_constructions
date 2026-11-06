import React from 'react';
import { motion } from 'motion/react';

interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  children?: React.ReactNode;
}

const ease = [0.22, 1, 0.36, 1] as const;

// Light masthead shared by every inner page: faint architectural grid and a
// soft blue glow, with the title rising in.
export const PageHeader = ({ eyebrow, title, subtitle, children }: PageHeaderProps) => {
  return (
    <header className="relative overflow-hidden border-b border-line bg-ivory pt-36 pb-16 md:pt-44 md:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-line) 1px, transparent 1px), linear-gradient(to bottom, var(--color-line) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'linear-gradient(to left, black, transparent 70%)',
          WebkitMaskImage: 'linear-gradient(to left, black, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(139,184,232,0.35), transparent 65%)' }}
      />

      <div className="container-x relative">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="eyebrow mb-6"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease }}
          className="display-xl max-w-4xl text-navy"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease }}
            className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.26, ease }}>
            {children}
          </motion.div>
        )}
      </div>
    </header>
  );
};
