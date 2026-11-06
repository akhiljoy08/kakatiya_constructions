import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { scrollToTop } from './SmoothScroll';

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 600);
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollToTop(!reduce);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          aria-label="Back to top"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          onClick={toTop}
          className="fixed right-5 bottom-24 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper text-gold-deep shadow-[0_10px_24px_-12px_rgba(19,35,57,0.35)] transition-colors hover:border-gold-deep hover:bg-gold-deep hover:text-white sm:right-8 sm:bottom-28"
        >
          <ArrowUp size={18} strokeWidth={1.5} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
