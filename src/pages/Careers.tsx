import React from 'react';
import { Mail } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/Reveal';
import { company } from '../data/company';

export const Careers = () => (
  <main id="main">
    <PageHeader
      eyebrow="Careers"
      title={<>Join our <em className="text-gold-deep">team</em></>}
    />

    <section className="section bg-paper">
      <Reveal className="container-x">
        <div className="mx-auto max-w-3xl rounded-3xl bg-ivory px-8 py-16 text-center ring-1 ring-line md:px-16 md:py-20">
          <p className="eyebrow justify-center">Openings</p>
          <h2 className="mt-6 text-3xl md:text-4xl">No current openings</h2>
          <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted">
            Please check back later or send your resume to us.
          </p>
          <a href={`mailto:${company.emails.careers}`} className="btn btn-navy mt-10">
            <Mail size={15} className="text-gold" aria-hidden="true" />
            {company.emails.careers}
          </a>
        </div>
      </Reveal>
    </section>
  </main>
);
