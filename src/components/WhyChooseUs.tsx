import React from 'react';
import { Shield, Users, Clock, Award, HardHat, Headphones } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { Reveal } from './Reveal';
import { company } from '../data/company';

const iconProps = { size: 22, strokeWidth: 1.6, 'aria-hidden': true } as const;

const features = [
  {
    icon: <Shield {...iconProps} />,
    title: "High Quality Materials",
    description: "We use only premium grade materials sourced from trusted manufacturers to ensure durability."
  },
  {
    icon: <HardHat {...iconProps} />,
    title: "Experienced Engineers",
    description: "Our team consists of industry veterans with decades of expertise in complex structures."
  },
  {
    icon: <Award {...iconProps} />,
    title: "Legal Compliance",
    description: "All our projects are 100% legally compliant with RERA and local municipal approvals."
  },
  {
    icon: <Clock {...iconProps} />,
    title: "On-Time Delivery",
    description: "We respect your time. Our track record of delivering projects on schedule is impeccable."
  },
  {
    icon: <Users {...iconProps} />,
    title: "Transparent Pricing",
    description: "No hidden costs. We provide detailed breakdowns and maintain complete financial transparency."
  },
  {
    icon: <Headphones {...iconProps} />,
    title: "Customer Support",
    description: "Our relationship doesn't end at handover. We provide dedicated post-purchase assistance."
  }
];

export const WhyChooseUs = () => {
  return (
    <section className="section relative isolate overflow-hidden bg-navy" aria-labelledby="why-title">
      {/* Soft light pools so the glass cards have something to refract */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -left-32 -z-10 h-[34rem] w-[34rem] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(139,184,232,0.28), transparent 65%)' }} />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -bottom-48 -z-10 h-[38rem] w-[38rem] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(30,90,168,0.45), transparent 65%)' }} />
      <div className="container-x">
        <SectionTitle
          eyebrow="Why choose us"
          title={<span id="why-title">Why choose {company.shortName}?</span>}
          subtitle="We don't just build structures; we build relationships based on trust, quality, and excellence."
          centered
          light
        />

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal
              as="li"
              key={feature.title}
              delay={(index % 3) * 0.08}
              className="group relative flex flex-col rounded-2xl bg-white/[0.06] p-7 ring-1 ring-white/10 backdrop-blur-md transition-[translate,background-color,box-shadow] duration-500 ease-out-soft hover:-translate-y-1.5 hover:bg-white/[0.1] hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] md:p-8"
            >
              {/* Accent bar that grows on hover */}
              <span aria-hidden="true" className="absolute inset-x-8 top-0 h-[3px] origin-left scale-x-0 rounded-b-full bg-gold transition-transform duration-500 ease-out-soft group-hover:scale-x-100" />
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-gold ring-1 ring-white/10 transition-colors duration-500 group-hover:bg-gold group-hover:text-navy">
                  {feature.icon}
                </span>
                <span className="font-serif text-lg text-white/25">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-7 text-[1.4rem] text-white">{feature.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/70">{feature.description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
};
