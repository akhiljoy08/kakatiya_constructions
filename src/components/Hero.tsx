import { HeroSlider, type HeroImageSlide } from './HeroSlider';
import signatureBanner from '../assets/kakatiya-signature-hero.jpg';
import towers from '../assets/LivingGatedCommunity.webp';
import interior from '../assets/hero-living.jpg';
import { company } from '../data/company';

/*
 * Hero — three slides.
 * 1. The Kakatiya Signature banner, shown whole with nothing on top.
 * 2–3. Photos with copy placed bottom-left (the darker part of both photos).
 */
const slides: HeroImageSlide[] = [
  {
    id: 'signature',
    name: 'Signature',
    image: signatureBanner,
    fit: 'contain',
    alt: 'Kakatiya Signature by Kakatiya Constructions, Tellapur near Exit No. 2: G+5 floors, 2 BHK and 3 BHK apartments, 1,260 to 1,863 sq. ft.',
  },
  {
    id: 'future',
    name: 'Future',
    image: towers,
    alt: 'High-rise residential towers rising above palm trees',
    content: {
      label: 'Building the future',
      title: 'Landmarks Hyderabad',
      highlight: 'lives in.',
      description: 'Thoughtfully planned homes and workspaces, engineered to stand the test of time.',
      primary: { label: 'Explore projects', to: '/projects' },
      secondary: { label: 'Contact us', to: '/contact' },
    },
  },
  {
    id: 'craft',
    name: 'Craft',
    image: interior,
    alt: 'Double-height living room with a staircase, marble floor and an indoor olive tree',
    content: {
      label: 'Quality & craftsmanship',
      title: 'Precision in',
      highlight: 'every detail.',
      description: 'Premium materials and experienced engineers, from the structure to the final finish.',
      primary: { label: 'Book a site visit', to: '/contact' },
      secondary: { label: 'Our story', to: '/about' },
    },
  },
];

export const Hero = () => (
  <section aria-labelledby="hero-title" className="bg-paper pt-[70px] md:pt-[82px] xl:pt-[90px]">
    {/* The banner's headline is part of the image; this keeps a real page heading for search engines and screen readers */}
    <h1 id="hero-title" className="sr-only">
      {company.name} — Kakatiya Signature, Tellapur
    </h1>
    <HeroSlider slides={slides} interval={6500} />
  </section>
);
