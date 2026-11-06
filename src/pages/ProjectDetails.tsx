import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { projects } from '../data/mockData';
import { FloorPlan } from '../components/FloorPlan';
import { SectionTitle } from '../components/SectionTitle';
import { Reveal } from '../components/Reveal';
import { NotFound } from './NotFound';

const ease = [0.22, 1, 0.36, 1] as const;

// Project page: just the floor plan, with a back link and the project name
// for context.
export const ProjectDetails = () => {
  const { id } = useParams();
  const project = projects.find((p) => String(p.id) === id);
  if (!project) return <NotFound />;

  const residential = project.category === 'Residential';

  return (
    <main id="main">
      <section className="section bg-ivory pt-32 md:pt-40" aria-labelledby="plan-title">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6"
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-navy transition-colors hover:text-gold-deep"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              All projects
            </Link>
            <p className="flex items-center gap-2 text-sm font-semibold text-navy">
              {project.name}
              <span className="text-line" aria-hidden="true">|</span>
              <span className="flex items-center gap-1.5 text-muted">
                <MapPin size={14} className="text-gold-deep" aria-hidden="true" />
                {project.location}
              </span>
            </p>
          </motion.div>

          <SectionTitle
            eyebrow={`${project.name} · Floor plan`}
            title={
              <span id="plan-title">
                {residential ? (
                  <>
                    Every room, <em className="text-gold-deep">thought through.</em>
                  </>
                ) : (
                  <>
                    Spaces built <em className="text-gold-deep">for business.</em>
                  </>
                )}
              </span>
            }
            subtitle={
              residential
                ? 'Explore an indicative home layout — see how the kitchen, living, bedrooms and bathrooms come together, and what each space includes.'
                : 'Flexible floor plates for offices and retail. Detailed layouts are shared on request.'
            }
          />

          <div className="mt-12">
            {residential ? (
              <FloorPlan />
            ) : (
              <Reveal className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-paper p-8 ring-1 ring-line md:flex-row md:items-center md:p-10">
                <p className="max-w-xl text-lg text-navy">Request detailed office and retail layouts, carpet areas and availability for {project.name}.</p>
                <Link to="/contact" className="btn btn-gold shrink-0">
                  Request layouts
                </Link>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
