import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../data/mockData';
import { TiltCard } from './TiltCard';

interface ProjectCardProps {
  project: Project;
  className?: string;
  /** Stagger delay (s) when several cards arrive together */
  delay?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, className = '', delay = 0 }) => {
  const ongoing = project.status === 'Ongoing';

  return (
    <motion.article
      layout
      // Arrives when scrolled into view (not on page load), staggered by `delay`.
      // The card is never clipped, so it owns the in-view check and hands
      // "shown" down to the photo unveil through variants.
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: { opacity: 0, y: 60, rotateX: 8, transformPerspective: 1200 },
        shown: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] } },
      }}
      exit={{ opacity: 0, y: 12, transition: { duration: 0.3 } }}
      className={`group ${className}`}
    >
      <TiltCard className="flex flex-col overflow-hidden rounded-2xl bg-paper shadow-[0_2px_6px_rgba(19,35,57,0.04),0_18px_40px_-24px_rgba(19,35,57,0.35)] ring-1 ring-line transition-shadow duration-500 group-hover:shadow-[0_2px_6px_rgba(19,35,57,0.05),0_34px_60px_-28px_rgba(19,35,57,0.5)]">
        <motion.div
          className="relative aspect-[4/3] overflow-hidden bg-line"
          variants={{
            hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
            shown: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.1, delay: delay + 0.15, ease: [0.77, 0, 0.175, 1] } },
          }}
        >
          <motion.img
            variants={{
              hidden: { scale: 1.2 },
              shown: { scale: 1, transition: { duration: 1.6, delay: delay + 0.15, ease: [0.22, 1, 0.36, 1] } },
            }}
            src={project.image}
            alt={`${project.name}, ${project.location}`}
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-[scale] duration-[1200ms] ease-out-soft group-hover:scale-[1.06]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy/45 via-transparent to-transparent" />
          <span
            className={`absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur-md ${
              ongoing ? 'bg-cta text-white' : 'bg-white/90 text-navy'
            }`}
          >
            {ongoing && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" aria-hidden="true" />}
            {project.status}
          </span>
          <span className="absolute right-4 bottom-4 rounded-full bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            {project.category}
          </span>
        </motion.div>

        <div className="flex flex-1 flex-col p-6">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
            <MapPin size={12} aria-hidden="true" />
            {project.location}
          </p>
          <h3 className="mt-2.5 text-2xl text-navy">
            {/* Stretched link: the whole card opens the project details page */}
            <Link
              to={`/projects/${project.id}`}
              className="after:absolute after:inset-0 after:z-10 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-gold-deep"
            >
              {project.name}
            </Link>
          </h3>
          <p className="mt-3 line-clamp-2 flex-1 text-[15px] leading-relaxed text-muted">{project.description}</p>

          <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
            <span className="text-[12px] font-semibold text-muted">{ongoing ? 'Bookings open' : 'Delivered'}</span>
            <span
              aria-hidden="true"
              className="inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-[0.16em] text-gold-deep transition-colors group-hover:text-cta"
            >
              {project.category === 'Residential' ? 'View floor plan' : 'View details'}
              <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </TiltCard>
    </motion.article>
  );
};
