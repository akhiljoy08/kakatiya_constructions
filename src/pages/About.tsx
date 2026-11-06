import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/Reveal';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { company } from '../data/company';
import brandImage from '../assets/kakatiya-logo.jpeg';

export const About = () => (
  <main id="main">
    <PageHeader
      eyebrow={`Since ${company.founded}`}
      title={<>About <em className="text-gold-deep">{company.shortName}</em></>}
    />

    <section className="section bg-paper">
      <div className="container-x grid items-start gap-16 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-6">
          <p className="font-serif text-3xl leading-[1.35] text-navy md:text-4xl">
            Founded in {company.founded}, {company.name} has built a reputation for excellence and reliability in the Hyderabad real estate market.
          </p>
          <p className="mt-8 max-w-xl text-base leading-[1.8] text-muted md:text-lg">
            With over 30 years of experience and 23+ completed projects, we continue to redefine urban living.
          </p>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-8">
            {company.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-serif text-4xl text-navy md:text-5xl">{s.value}</dd>
                <dd className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted sm:text-[11px]">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
          <figure>
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-line lg:aspect-[4/5]">
              <img
                src={brandImage}
                alt={`${company.name} — Building Trust Since 2012`}
                width={1196}
                height={887}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </div>
            <figcaption className="mt-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
              <span aria-hidden="true" className="h-px w-8 bg-gold" />
              {company.name} · Building Trust Since 2012
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>

    <section className="bg-ivory py-20 md:py-24" aria-labelledby="expertise-title">
      <div className="container-x grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6">What we build</p>
          <h2 id="expertise-title" className="text-4xl">Our expertise</h2>
        </div>
        <ul className="grid border-t border-line sm:grid-cols-2 lg:col-span-8">
          {company.expertise.map((item, i) => (
            <li key={item} className="flex items-baseline gap-5 border-b border-line py-6 sm:odd:pr-8">
              <span className="font-serif text-base text-gold-deep">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-lg font-semibold text-navy">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <WhyChooseUs />

    <section className="bg-paper py-20 md:py-24">
      <div className="container-x flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <h2 className="text-3xl md:text-4xl">See what we've built.</h2>
        <Link to="/projects" className="btn btn-navy group">
          Explore projects
          <ArrowRight size={16} className="text-gold transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </section>
  </main>
);
