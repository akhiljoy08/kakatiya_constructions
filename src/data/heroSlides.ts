import towers from '../assets/LivingGatedCommunity.webp';
import interior from '../assets/hero-living.jpg';
import grandeur from '../assets/image1.jpeg';
import type { HeroSlide } from '../components/HeroCarousel';

export const heroSlides: HeroSlide[] = [
  {
    id: 'future',
    image: towers,
    alt: 'High-rise residential towers rising above palm trees',
    label: 'Building the future',
    title: 'Landmarks Hyderabad',
    highlight: 'lives in.',
    description: 'Since 1995 we have planned, engineered and delivered homes and workspaces that stand the test of time.',
    highlights: ['RERA-compliant projects', 'On-time delivery', 'Transparent pricing', 'Trusted since 1995'],
    primary: { label: 'Explore our projects', to: '/projects' },
    secondary: { label: 'Contact us', to: '/contact' },
  },
  {
    id: 'residential',
    image: grandeur,
    alt: 'Kakatiya Grandeur residential apartments in Madhapur',
    label: 'Residential communities',
    title: 'Homes designed',
    highlight: 'for generations.',
    description: 'Thoughtfully planned apartments and gated communities with premium materials and open, light-filled layouts.',
    highlights: ['Ultra-luxury 3 BHK homes', 'Modern amenities', 'Sustainable design', 'Madhapur, Hyderabad'],
    primary: { label: 'Explore our projects', to: '/projects' },
    secondary: { label: 'Contact us', to: '/contact' },
  },
  {
    id: 'craft',
    image: interior,
    alt: 'Double-height living room with a staircase, marble floor and an indoor olive tree',
    label: 'Quality & craftsmanship',
    title: 'Precision in',
    highlight: 'every detail.',
    description: 'From structure to finishes, experienced engineers and trusted suppliers deliver interiors you will be proud of.',
    highlights: ['Premium-grade materials', 'Experienced engineers', 'Strict quality checks', 'Post-handover support'],
    primary: { label: 'Explore our projects', to: '/projects' },
    secondary: { label: 'Contact us', to: '/contact' },
  },
];
