import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/Reveal';
import { projects } from '../data/mockData';

export const Gallery = () => (
  <main id="main">
    <PageHeader
      eyebrow="Gallery"
      title={<>Project <em className="text-gold-deep">gallery</em></>}
      subtitle="A closer look at our residential and commercial developments across Hyderabad."
    />

    <section className="section bg-paper">
      <ul className="container-x columns-1 gap-6 sm:columns-2 lg:columns-3">
        {projects.map((project, i) => (
          <Reveal as="li" key={project.id} delay={(i % 3) * 0.08} className="mb-6 break-inside-avoid">
            <figure className="group relative overflow-hidden rounded-2xl bg-line shadow-[0_20px_40px_-30px_rgba(19,35,57,0.5)]">
              <img
                src={project.image}
                alt={`${project.name}, ${project.location}`}
                loading="lazy"
                decoding="async"
                className="w-full transition-transform duration-[1200ms] ease-out-soft group-hover:scale-[1.05]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-navy/85 to-transparent p-6 pt-16 transition-transform duration-500 ease-out-soft group-hover:translate-y-0">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">{project.location}</span>
                <span className="mt-1 block font-serif text-xl text-white">{project.name}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </section>
  </main>
);
