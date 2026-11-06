import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ClipboardCheck, Clock, HardHat, KeyRound, MapPin, Phone, Quote, Star } from 'lucide-react';
import { Hero } from '../components/Hero';
import { SectionTitle } from '../components/SectionTitle';
import { ProjectCard } from '../components/ProjectCard';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { Reveal, RevealImage } from '../components/Reveal';
import { Parallax } from '../components/Parallax';
import { projects, testimonials } from '../data/mockData';
import { company } from '../data/company';

const aboutImage = projects[5];
// Ongoing projects lead, then the rest — three cards in total
const futureProjects = [...projects].sort((a, b) => Number(b.status === 'Ongoing') - Number(a.status === 'Ongoing')).slice(0, 3);

const detailImage = projects[2];
const ctaImage = projects[4];

// Wording drawn from claims the site already makes (approvals, materials, engineers, delivery, support)
const buildSteps = [
  { icon: ClipboardCheck, title: 'Plan with purpose', text: 'Thoughtful layouts in prime locations, with RERA and municipal approvals in place.' },
  { icon: HardHat, title: 'Build with quality', text: 'Premium-grade materials and experienced engineers on every site.' },
  { icon: KeyRound, title: 'Deliver on our promise', text: 'On-time handover, transparent pricing and dedicated support after you move in.' },
];

const initials = (name: string) => name.split(' ').map((n) => n[0]).join('').slice(0, 2);

export const Home = () => {
  return (
    <main id="main">
      <Hero />

      {/* Our legacy — layered photo collage + how we build */}
      <section className="section overflow-hidden bg-ivory" aria-labelledby="legacy-title">
        <div className="container-x grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
          {/* Collage: two photos at different scroll depths and a floating badge */}
          <Reveal className="relative pb-16 sm:pb-20 lg:col-span-6 lg:pb-14">
            <RevealImage className="relative aspect-[4/5] w-[78%]" frameClassName="rounded-2xl shadow-[0_30px_60px_-35px_rgba(19,35,57,0.5)]">
              <Parallax strength={6}>
                <img
                  src={aboutImage.image}
                  alt={`${aboutImage.name}, ${aboutImage.location}`}
                  width={960}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </Parallax>
            </RevealImage>

            <RevealImage delay={0.3} className="absolute right-0 bottom-0 aspect-[4/5] w-[46%]" frameClassName="rounded-2xl shadow-[0_30px_60px_-30px_rgba(19,35,57,0.55)] ring-8 ring-ivory">
              <Parallax strength={11}>
                <img
                  src={detailImage.image}
                  alt={`${detailImage.name}, ${detailImage.location}`}
                  width={600}
                  height={750}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </Parallax>
            </RevealImage>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[8%] right-[4%] rounded-2xl bg-paper/90 px-5 py-4 shadow-[0_24px_50px_-24px_rgba(19,35,57,0.45)] ring-1 ring-line backdrop-blur-md sm:px-6 sm:py-5"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-deep">Established</p>
              <p className="mt-1 font-serif text-4xl leading-none text-navy sm:text-5xl">{company.founded}</p>
              <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                <MapPin size={12} aria-hidden="true" />
                {company.city}
              </p>
            </motion.div>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7 xl:col-span-5 xl:col-start-8">
            <SectionTitle
              eyebrow="Our legacy"
              title={<span id="legacy-title">A legacy of <em className="text-gold-deep">excellence.</em></span>}
              subtitle={`${company.name} has been at the forefront of Hyderabad's real estate transformation since ${company.founded}.`}
            />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl leading-[1.8] text-muted">
                Trust, quality and on-time delivery have made {company.shortName} a name families rely on. Every project follows the same
                careful path, from the first plan to the day we hand over the keys.
              </p>
            </Reveal>

            <ol className="mt-10 border-b border-line" aria-label="How we build">
              {buildSteps.map((step, i) => (
                <Reveal as="li" key={step.title} delay={0.15 + i * 0.1} className="group flex gap-5 border-t border-line py-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-paper text-gold-deep shadow-[0_6px_16px_-10px_rgba(19,35,57,0.4)] ring-1 ring-line transition-colors duration-500 group-hover:bg-cta group-hover:text-white group-hover:ring-cta">
                    <step.icon size={20} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="flex items-baseline gap-3">
                      <span className="font-serif text-sm text-gold-deep">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-lg font-semibold text-navy">{step.title}</span>
                    </span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-muted">{step.text}</span>
                  </span>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={0.45} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <Link to="/about" className="btn btn-navy group">
                Learn more about us
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link to="/projects" className="link-arrow">
                <span>View our projects</span>
                <ArrowRight size={16} className="text-gold-deep" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Future projects — ongoing developments first */}
      <section className="section bg-paper" aria-labelledby="featured-title">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionTitle
              eyebrow="Now building"
              title={<span id="featured-title">Future <em className="text-gold-deep">projects</em></span>}
              subtitle="Discover the homes and spaces we are building next — tap any project to explore its details and floor plan."
            />
            <Link to="/projects" className="btn btn-outline-dark shrink-0 self-start md:self-auto">
              View all projects
            </Link>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {futureProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} delay={i * 0.12} />
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs />

      {/* Testimonials */}
      <section className="section bg-ivory" aria-labelledby="testimonials-title">
        <div className="container-x">
          <SectionTitle
            eyebrow="Testimonials"
            title={<span id="testimonials-title">What our clients say</span>}
            subtitle={`The trust of our clients is our greatest achievement. Hear from those who chose ${company.shortName}.`}
            centered
          />

          <ul className="mt-14 grid gap-5 md:grid-cols-3 lg:gap-6">
            {testimonials.map((t, i) => (
              <Reveal
                as="li"
                key={t.id}
                delay={i * 0.08}
                className="flex flex-col rounded-2xl bg-paper p-7 shadow-[0_2px_6px_rgba(19,35,57,0.05),0_18px_40px_-26px_rgba(19,35,57,0.35)] ring-1 ring-line transition-[translate,box-shadow] duration-500 ease-out-soft hover:-translate-y-1.5 hover:shadow-[0_2px_6px_rgba(19,35,57,0.05),0_34px_60px_-28px_rgba(19,35,57,0.5)] md:p-8"
              >
                <figure className="flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-deep/10 text-gold-deep" aria-hidden="true">
                      <Quote size={20} strokeWidth={1.6} />
                    </span>
                    <span className="flex gap-0.5" aria-label={`Rated ${t.rating} out of 5`} role="img">
                      {Array.from({ length: 5 }, (_, s) => (
                        <Star
                          key={s}
                          size={15}
                          aria-hidden="true"
                          className={s < t.rating ? 'fill-gold-deep text-gold-deep' : 'text-navy/15'}
                        />
                      ))}
                    </span>
                  </div>
                  <blockquote className="mt-6 flex-1 font-serif text-xl leading-[1.5] text-navy md:text-[1.3rem]">
                    “{t.review}”
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4 border-t border-line pt-6">
                    <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold tracking-widest text-white">
                      {initials(t.name)}
                    </span>
                    <span>
                      <span className="block font-semibold text-navy">{t.name}</span>
                      <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep">{t.apartment}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA — split card: copy on navy, photo beside it */}
      <section className="bg-paper pb-24 md:pb-32" aria-labelledby="cta-title">
        <div className="container-x">
          <Reveal className="relative grid overflow-hidden rounded-3xl bg-navy shadow-[0_40px_80px_-40px_rgba(19,35,57,0.6)] lg:grid-cols-2">
            {/* Soft light from the top-left corner */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(60% 80% at 0% 0%, rgba(139,184,232,0.18), transparent 60%)' }}
            />

            <div className="relative p-8 sm:p-12 lg:p-14 xl:p-16">
              <p className="eyebrow eyebrow-light mb-6">Visit us</p>
              <h2 id="cta-title" className="display-lg text-white">
                Ready to find your <em className="text-gold">dream home?</em>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/75 md:text-lg">
                Contact our experts today for a personalized consultation and site visit to our ongoing projects.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link to="/contact" className="btn btn-light group">
                  Book a site visit
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <a href={company.phones[0].href} className="btn btn-outline-light">
                  <Phone size={14} aria-hidden="true" />
                  Call us now
                </a>
              </div>

              <ul className="mt-10 grid gap-3 border-t border-white/10 pt-8 text-sm text-white/75 sm:grid-cols-2">
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                  <span>{company.address.split(',').slice(2, 4).join(',').trim()}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                  <span>{company.hours[0]}</span>
                </li>
              </ul>
            </div>

            <RevealImage delay={0.25} radius={0} className="group relative min-h-[18rem] lg:min-h-full">
              <Parallax strength={6}>
                <img
                  src={ctaImage.image}
                  alt={`${ctaImage.name}, ${ctaImage.location}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-[1500ms] ease-out-soft group-hover:scale-105"
                />
              </Parallax>
              {/* Blend the photo into the navy panel */}
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent lg:bg-gradient-to-r lg:from-navy lg:via-navy/10 lg:via-25% lg:to-transparent" />
              <span className="absolute right-5 bottom-5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-navy backdrop-blur-md">
                {ctaImage.name} · {ctaImage.location.split(',')[0]}
              </span>
            </RevealImage>
          </Reveal>
        </div>
      </section>
    </main>
  );
};
