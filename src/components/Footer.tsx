import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { company, mapsUrl } from '../data/company';

const exploreLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Our Projects', path: '/projects' },
  { name: 'Ongoing Projects', path: '/projects?status=Ongoing' },
  { name: 'Completed Projects', path: '/projects?status=Completed' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Careers', path: '/careers' },
  { name: 'Contact', path: '/contact' },
];

const socials = [
  { name: 'Facebook', icon: Facebook },
  { name: 'Instagram', icon: Instagram },
  { name: 'LinkedIn', icon: Linkedin },
  { name: 'Twitter', icon: Twitter },
];

const headingClass = 'mb-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold';
const linkClass = 'text-[15px] text-white/70 transition-colors hover:text-white';

export const Footer = () => {
  return (
    <footer className="bg-navy text-white">
      <div className="container-x">
        {/* Top band */}
        <div className="flex flex-col gap-10 border-b border-white/10 py-16 md:flex-row md:items-end md:justify-between md:py-20">
          <div className="max-w-md">
            <Logo />
            <p className="mt-8 text-[15px] leading-relaxed text-white/70">
              Building trust for over 30 years with excellence in construction and commitment to quality. Delivering premium residential and commercial spaces.
            </p>
          </div>
          <Link to="/contact" className="group max-w-md md:text-right">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">Plan a site visit</span>
            <span className="mt-3 inline-flex items-center gap-3 font-serif text-3xl text-white transition-colors group-hover:text-gold md:text-4xl">
              Let's talk
              <ArrowUpRight size={28} strokeWidth={1.25} className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
            </span>
          </Link>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <nav aria-label="Footer" className="lg:col-span-3">
            <h2 className={`${headingClass} font-sans`}>Explore</h2>
            <ul className="grid gap-3">
              {exploreLinks.map((link) => (
                <li key={link.path}><Link to={link.path} className={linkClass}>{link.name}</Link></li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className={`${headingClass} font-sans`}>Our Expertise</h2>
            <ul className="grid gap-3">
              {company.expertise.map((item) => (
                <li key={item} className="text-[15px] text-white/70">{item}</li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-6">
            <h2 className={`${headingClass} font-sans`}>Contact</h2>
            <ul className="grid gap-6 sm:grid-cols-2">
              <li className="flex gap-4 sm:col-span-2">
                <MapPin className="mt-1 shrink-0 text-gold" size={18} strokeWidth={1.5} aria-hidden="true" />
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={`${linkClass} max-w-xs leading-relaxed`}>
                  {company.address}
                </a>
              </li>
              <li className="flex gap-4">
                <Phone className="mt-1 shrink-0 text-gold" size={18} strokeWidth={1.5} aria-hidden="true" />
                <div className="grid gap-1">
                  {company.phones.map((p) => (
                    <a key={p.href} href={p.href} className={linkClass}>{p.label}</a>
                  ))}
                </div>
              </li>
              <li className="flex gap-4">
                <Mail className="mt-1 shrink-0 text-gold" size={18} strokeWidth={1.5} aria-hidden="true" />
                <a href={`mailto:${company.emails.info}`} className={`${linkClass} break-all`}>{company.emails.info}</a>
              </li>
              <li className="text-[15px] leading-relaxed text-white/55 sm:col-span-2 sm:pl-[34px]">
                {company.hours.join(' · ')}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse gap-6 border-t border-white/10 py-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/55">
            © {new Date().getFullYear()} {company.name}. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link to="/privacy" className="text-xs text-white/55 transition-colors hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-white/55 transition-colors hover:text-white">Terms & Conditions</Link>
            <ul className="flex gap-2">
              {socials.map(({ name, icon: Icon }) => (
                <li key={name}>
                  <a
                    href="#"
                    aria-label={name}
                    className="flex h-10 w-10 items-center justify-center border border-white/10 text-white/70 transition-colors hover:border-gold hover:text-white"
                  >
                    <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
