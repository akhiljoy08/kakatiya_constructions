import image1 from '../assets/image1.jpeg';
import image2 from '../assets/image2.jpeg';
import image3 from '../assets/image3.jpeg';
import image4 from '../assets/image4.jpeg';
import image5 from '../assets/image5.jpeg';
import image6 from '../assets/image6.jpeg';

export interface Project {
  id: number;
  name: string;
  location: string;
  status: 'Completed' | 'Ongoing';
  description: string;
  image: string;
  category: string;
}

export const projects: Project[] = [
  {
    id: 1,
    name: "Kakatiya Grandeur",
    location: "Madhapur, Hyderabad",
    status: 'Completed',
    description: "Ultra-luxury 3BHK apartments with modern amenities and sustainable design.",
    image: image1,
    category: "Residential"
  },
  {
    id: 2,
    name: "Kakatiya Kuteer",
    location: "Gachibowli, Hyderabad",
    status: 'Ongoing',
    description: "Premium high-rise gated community featuring panoramic city views.",
    image: image2,
    category: "Residential"
  },
  {
    id: 3,
    name: "Kakatiya Elite-1",
    location: "Banjara Hills, Hyderabad",
    status: 'Completed',
    description: "State-of-the-art commercial complex designed for corporate excellence.",
    image: image3,
    category: "Commercial"
  },
  {
    id: 4,
    name: "Kakatiya Sri Nilayam",
    location: "Kukatpally, Hyderabad",
    status: 'Completed',
    description: "Eco-friendly residential project with 60% open green spaces.",
    image: image4,
    category: "Residential"
  },
  {
    id: 5,
    name: "Kakatiya Bommakanti Nest",
    location: "Kondapur, Hyderabad",
    status: 'Ongoing',
    description: "Modern retail and office space at the heart of the IT corridor.",
    image: image5,
    category: "Commercial"
  },
  {
    id: 6,
    name: "Kakatiya Emerald",
    location: "Tellapur, Hyderabad",
    status: 'Completed',
    description: "Exclusive luxury villas blending traditional aesthetics with modern comfort.",
    image: image6,
    category: "Residential"
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    apartment: "Kakatiya Royal Residency",
    review: "The quality of construction and attention to detail is unmatched. Kakatiya delivered our home exactly on time as promised.",
    rating: 5
  },
  {
    id: 2,
    name: "Anjali Sharma",
    apartment: "Kakatiya Emerald Gardens",
    review: "Living in a Kakatiya project is a dream. The ventilation and space planning are excellent. Highly recommended!",
    rating: 5
  },
  {
    id: 3,
    name: "Vikram Reddy",
    apartment: "Kakatiya Business Hub",
    review: "Professionalism at its best. Their commercial projects are designed with a futuristic vision. Great investment.",
    rating: 5
  }
];
