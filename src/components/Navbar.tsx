import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { Logo } from './Logo';
import { setScrollLocked } from './SmoothScroll';
import { motion, AnimatePresence } from 'motion/react';
import { company, mapsUrl } from '../data/company';

const menuGroups = [
  {
    title: 'Our Company',
    links: [
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about' },
      { name: 'Our Projects', path: '/projects' },
      { name: 'Gallery', path: '/gallery' },
    ],
  },
  {
    title: 'Quick Links',
    links: [
      { name: 'Ongoing Projects', path: '/projects?status=Ongoing' },
      { name: 'Completed Projects', path: '/projects?status=Completed' },
      { name: 'Careers', path: '/careers' },
      { name: 'Contact Us', path: '/contact' },
    ],
  },
];

const groupTitleClass = 'mb-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted md:text-xs xl:mb-8 xl:text-sm';
const pillClass =
  'flex h-11 items-center justify-center gap-2 rounded-full md:h-12 border border-current/25 bg-current/5 backdrop-blur-sm transition-colors hover:border-current hover:bg-current/10';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock page scroll and allow Escape to close while the menu is open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsOpen(false);
      toggleRef.current?.focus();
    };
    document.body.style.overflow = 'hidden';
    setScrollLocked(true);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      setScrollLocked(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  // Solid charcoal bar on every page, like the reference (the split hero has no photo behind the bar)
  const atTop = !scrolled && !isOpen;
  const overHero = false;
  const solidBar = !overHero;
  // Compare with the query string so "Ongoing Projects" doesn't also light up "Our Projects"
  const currentPath = location.pathname + location.search;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[55] border-b transition-[background-color,border-color,padding,color,box-shadow] duration-500 ${
        isOpen
          ? 'border-line bg-paper py-3 text-navy'
          : solidBar
            ? 'border-line bg-nav-solid/95 py-3 text-nav-ink shadow-[0_8px_24px_-18px_rgba(19,35,57,0.35)] backdrop-blur-md'
            : `border-transparent bg-transparent py-6 ${overHero ? 'text-white' : 'text-nav-ink'}`
      }`}
    >
      <nav aria-label="Main" className="flex w-full items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        {/* Menu toggle — left */}
        <div className="flex flex-1 justify-start">
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="site-menu"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className={`${pillClass} w-[70px] md:w-20`}
          >
            {isOpen ? <X size={22} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={22} strokeWidth={1.5} aria-hidden="true" />}
          </button>
        </div>

        {/* Logo — centre */}
        <Link to="/" aria-label={`${company.name} — home`} className="shrink-0">
          <Logo size="lg" nameClass="text-current" tagClass="text-gold-deep" />
        </Link>

        {/* Contact — right */}
        <div className="flex flex-1 justify-end">
          <Link to="/contact" className={`${pillClass} px-4 text-[13px] font-semibold tracking-[0.06em] sm:px-7 md:text-sm xl:px-8 xl:text-base`}>
            <Phone size={14} className="text-nav-accent sm:hidden" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Contact Us</span>
          </Link>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dim the page below the panel; clicking it closes the menu */}
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 -z-10 bg-navy/25 backdrop-blur-[2px]"
            />

            <motion.div
              id="site-menu"
              data-lenis-prevent
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full max-h-[calc(100svh-70px)] xl:max-h-[calc(100svh-90px)] overflow-y-auto border-b border-line bg-paper shadow-[0_30px_60px_-30px_rgba(19,35,57,0.35)]"
            >
              {/* Soft accent glow on the right, after the reference design */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: 'radial-gradient(60% 90% at 100% 60%, color-mix(in srgb, var(--color-gold) 22%, transparent), transparent 70%)' }}
              />

              <div className="relative flex w-full flex-wrap justify-between gap-x-8 gap-y-12 px-5 py-12 sm:px-8 md:py-16 lg:px-12 xl:py-20">
                {menuGroups.map((group, g) => (
                  <div key={group.title} className="min-w-[12rem] flex-1 lg:flex-none">
                    <p className={groupTitleClass}>{group.title}</p>
                    <ul className="grid gap-4 lg:gap-5">
                      {group.links.map((link, i) => (
                        <motion.li
                          key={link.path}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 + 0.04 * (g * group.links.length + i), duration: 0.35 }}
                        >
                          <Link
                            to={link.path}
                            aria-current={currentPath === link.path ? 'page' : undefined}
                            className={`text-xl transition-colors sm:text-2xl lg:text-[1.75rem] xl:text-[2rem] ${
                              currentPath === link.path ? 'text-gold-deep' : 'text-navy hover:text-gold-deep'
                            }`}
                          >
                            {link.name}
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="w-full border-t border-line pt-10 lg:w-auto lg:max-w-sm lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12 xl:max-w-md">
                  <p className={groupTitleClass}>Get in touch</p>
                  <ul className="grid gap-5 text-[15px] text-charcoal/80 md:text-base xl:text-lg">
                    <li className="flex gap-4">
                      <Phone size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
                      <span className="grid gap-1">
                        {company.phones.map((p) => (
                          <a key={p.href} href={p.href} className="transition-colors hover:text-gold-deep">{p.label}</a>
                        ))}
                      </span>
                    </li>
                    <li className="flex gap-4">
                      <Mail size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
                      <a href={`mailto:${company.emails.info}`} className="break-all transition-colors hover:text-gold-deep">{company.emails.info}</a>
                    </li>
                    <li className="flex gap-4">
                      <MapPin size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="leading-relaxed transition-colors hover:text-gold-deep">
                        {company.address}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
