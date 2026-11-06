import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, ClipboardCheck, Clock, HardHat, KeyRound, MapPin, Phone, Quote, Star } from 'lucide-react';
import { Hero } from '../components/Hero';
import { SectionTitle } from '../components/SectionTitle';
import { ProjectCard } from '../components/ProjectCard';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { Reveal, RevealImage } from '../components/Reveal';
import { Parallax } from '../components/Parallax';
import { projects, testimonials } from '../data/mockData';
import { company, mapsUrl } from '../data/company';

const aboutImage = projects[5];
// Ongoing projects lead, then the rest — three cards in total
const futureProjects = [...projects].sort((a, b) => Number(b.status === 'Ongoing') - Number(a.status === 'Ongoing')).slice(0, 3);

const detailImage = projects[2];
// Office location for the map in the closing section (Road No. 12, Banjara Hills)
const officeArea = company.address.split(',').slice(2, 4).join(',').trim();
const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(company.address)}&z=15&output=embed`;

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

      {/* CTA — full-width split band (no card): copy left, office map to the right edge */}
      <section className="grid border-t border-line bg-paper lg:grid-cols-2" aria-labelledby="cta-title">
        <Reveal className="flex flex-col justify-center px-5 py-20 sm:px-8 md:py-24 lg:py-28 lg:pr-16 lg:pl-[max(3rem,calc((100vw-1240px)/2+3rem))]">
          <p className="eyebrow mb-6">Visit us</p>
          <h2 id="cta-title" className="display-lg">
            Ready to find your <em className="text-gold-deep">dream home?</em>
          </h2>
          <p className="lead mt-6 max-w-md">
            Contact our experts today for a personalized consultation and site visit to our ongoing projects.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link to="/contact" className="btn btn-gold group">
              Book a site visit
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <a href={company.phones[0].href} className="btn btn-outline-dark">
              <Phone size={14} aria-hidden="true" />
              Call us now
            </a>
          </div>

          <ul className="mt-10 grid max-w-lg gap-3 border-t border-line pt-8 text-sm text-muted sm:grid-cols-2">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
              <span>{officeArea}</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={16} className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
              <span>{company.hours[0]}</span>
            </li>
          </ul>
        </Reveal>

        {/* Google Map of the office location (embed — no API key needed) */}
        <RevealImage delay={0.2} radius={0} className="relative min-h-[22rem] sm:min-h-[26rem] lg:min-h-full">
          <iframe
            title={`Map showing ${company.name}, ${officeArea}`}
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white/95 p-3 pr-5 shadow-[0_20px_40px_-20px_rgba(19,35,57,0.55)] ring-1 ring-line backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cta text-white" aria-hidden="true">
              <MapPin size={18} />
            </span>
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Our office</span>
              <span className="block text-sm font-semibold text-navy">{officeArea}</span>
            </span>
            <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gold-deep">
              Directions
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </span>
          </a>
        </RevealImage>
      </section>
    </main>
  );
};
