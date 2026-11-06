export const company = {
  name: 'Kakatiya Constructions',
  shortName: 'Kakatiya',
  founded: 1995,
  city: 'Hyderabad',
  address: '123 Kakatiya Towers, Road No. 12, Banjara Hills, Hyderabad, Telangana 500034',
  phones: [
    { label: '+91 98765 43210', href: 'tel:+919876543210' },
    { label: '+91 40 1234 5678', href: 'tel:+914012345678' },
  ],
  emails: {
    info: 'info@kakteyaconstructions.com',
    sales: 'sales@kakteyaconstructions.com',
    careers: 'careers@kakteyaconstructions.com',
  },
  whatsapp: 'https://wa.me/919876543210',
  hours: ['Mon – Sat: 9:00 AM – 7:00 PM', 'Sunday: Closed'],
  stats: [
    { value: '20+', label: 'Years of legacy' },
    { value: '23+', label: 'Projects completed' },
    { value: '2500+', label: 'Happy families' },
  ],
  expertise: [
    'Residential Apartments',
    'Luxury Villas',
    'Commercial Hubs',
    'Gated Communities',
    'Interior Design',
    'Project Management',
  ],
};

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`;
