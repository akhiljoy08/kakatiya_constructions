import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { ContactForm } from '../components/ContactForm';
import { Reveal } from '../components/Reveal';
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { company, mapsUrl } from '../data/company';

const iconClass = 'mt-1 shrink-0 text-gold-deep';
const linkClass = 'text-charcoal transition-colors hover:text-gold-deep';

export const Contact = () => {
  const details = [
    {
      icon: MapPin,
      title: 'Our Office',
      body: (
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={`${linkClass} leading-relaxed`}>
          {company.address}
        </a>
      ),
    },
    {
      icon: Phone,
      title: 'Call Us',
      body: company.phones.map((p) => (
        <a key={p.href} href={p.href} className={`${linkClass} block`}>{p.label}</a>
      )),
    },
    {
      icon: Mail,
      title: 'Email Us',
      body: [company.emails.info, company.emails.sales].map((email) => (
        <a key={email} href={`mailto:${email}`} className={`${linkClass} block break-all`}>{email}</a>
      )),
    },
    {
      icon: Clock,
      title: 'Working Hours',
      body: company.hours.map((h) => <span key={h} className="block text-charcoal">{h}</span>),
    },
  ];

  return (
    <main id="main">
      <PageHeader
        eyebrow="Contact"
        title={<>Get in <em className="text-gold-deep">touch</em></>}
        subtitle="Have a question about our projects or want to schedule a site visit? We're here to help."
      />

      <section className="section bg-paper">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-12">
          {/* Contact Info */}
          <Reveal className="lg:col-span-4">
            <p className="eyebrow mb-8">Contact information</p>
            <ul className="border-t border-line">
              {details.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-5 border-b border-line py-7">
                  <Icon className={iconClass} size={18} strokeWidth={1.5} aria-hidden="true" />
                  <div className="text-[15px]">
                    <h2 className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">{title}</h2>
                    {body}
                  </div>
                </li>
              ))}
            </ul>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 flex items-center justify-between rounded-2xl bg-cta p-7 text-white shadow-[0_20px_40px_-24px_rgba(30,78,140,0.7)] transition-[background-color,translate] duration-300 hover:-translate-y-1 hover:bg-cta-hover"
            >
              <span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-white/75">Directions</span>
                <span className="mt-2 block font-serif text-2xl">View on Google Maps</span>
              </span>
              <ArrowUpRight size={24} strokeWidth={1.25} className="text-white/80 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
            </a>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </main>
  );
};
