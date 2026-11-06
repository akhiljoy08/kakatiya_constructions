import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader } from '../components/PageHeader';
import { projects } from '../data/mockData';
import { ProjectCard } from '../components/ProjectCard';

export const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');
  const [activeFilter, setActiveFilter] = useState(statusFilter || 'All');

  useEffect(() => {
    if (statusFilter) {
      setActiveFilter(statusFilter);
    } else {
      setActiveFilter('All');
    }
  }, [statusFilter]);

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.status === activeFilter);

  const filterOptions = ['All', 'Ongoing', 'Completed'];
  const countFor = (option: string) =>
    option === 'All' ? projects.length : projects.filter((p) => p.status === option).length;

  return (
    <main id="main">
      <PageHeader
        eyebrow="Portfolio"
        title={<>Our <em className="text-gold-deep">projects</em></>}
        subtitle="From landmark commercial hubs to luxury residential communities, explore our diverse portfolio."
      />

      <section className="section bg-paper pt-14 md:pt-16 lg:pt-16">
        <div className="container-x">
          {/* Filter — pill switcher; the white highlight slides between options */}
          <div role="group" aria-label="Filter projects by status" className="inline-flex rounded-full bg-ivory p-1.5 ring-1 ring-line">
            {filterOptions.map((option) => {
              const active = activeFilter === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setActiveFilter(option);
                    setSearchParams(option === 'All' ? {} : { status: option });
                  }}
                  className={`relative flex items-baseline gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.16em] transition-colors sm:px-6 ${
                    active ? 'text-navy' : 'text-muted hover:text-navy'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="project-filter"
                      className="absolute inset-0 rounded-full bg-paper shadow-[0_6px_16px_-8px_rgba(19,35,57,0.35)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{option}</span>
                  <span className={`relative font-serif text-sm tracking-normal ${active ? 'text-gold-deep' : 'text-muted/70'}`}>
                    {String(countFor(option)).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>

          <motion.div
            layout
            className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} delay={(i % 3) * 0.1} />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-xl text-muted">No projects found for this category.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
