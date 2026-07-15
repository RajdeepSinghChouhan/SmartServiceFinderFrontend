export type Service = {
  id: number;
  providerId: number;
  providerUserId: number;

  businessName: string;
  title: string;
  description: string;

  experience: string;
  rating: number;
  verified: boolean;

  price: number;
  available: boolean;

  categoryId: number | null;

  createdAt: string;
};

export type Provider = {
  id: number;
  businessName: string;
  description: string;
  experience: number;
  rating: number;
  reviewCount: number;
};

export type Review = {
  id: number;
  serviceId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export const categories = [
  { id: 1, name: "Electrician", icon: "Zap" },
  { id: 2, name: "Plumber", icon: "Wrench" },
  { id: 3, name: "Painter", icon: "Paintbrush" },
  { id: 4, name: "Carpenter", icon: "Hammer" },
  { id: 5, name: "Cleaning", icon: "Sparkles" },
  { id: 6, name: "Salon", icon: "Scissors" },
  { id: 7, name: "AC Repair", icon: "Wind" },
  { id: 8, name: "Home Appliances", icon: "Refrigerator" },
];

export const providers: Provider[] = [
  { id: 1, businessName: "BrightSpark Electricals", description: "Licensed electricians for residential and commercial wiring, installations and emergency repairs.", experience: 8, rating: 4.8, reviewCount: 142 },
  { id: 2, businessName: "AquaFlow Plumbing", description: "24/7 plumbing solutions — leak repairs, installations, drain cleaning and bathroom fittings.", experience: 12, rating: 4.7, reviewCount: 98 },
  { id: 3, businessName: "ColorCraft Painters", description: "Interior & exterior painting with eco-friendly paints and a 2-year quality guarantee.", experience: 6, rating: 4.9, reviewCount: 76 },
  { id: 4, businessName: "SparklePro Cleaning", description: "Deep cleaning, sofa & carpet cleaning, and kitchen disinfection by trained crews.", experience: 5, rating: 4.6, reviewCount: 211 },
  { id: 5, businessName: "CoolBreeze AC Services", description: "AC installation, gas refill, deep cleaning and AMC plans for all major brands.", experience: 10, rating: 4.8, reviewCount: 165 },
  { id: 6, businessName: "Glamour Studio at Home", description: "Salon-quality hair, makeup and grooming services in the comfort of your home.", experience: 7, rating: 4.9, reviewCount: 189 },
];

export const services: Service[] = [
  {
    id: 101,
    providerId: 1,
    providerUserId: 1,
    businessName: "BrightSpark Electricals",
    title: "Home Electrical Wiring & Repair",
    description: "Full home wiring inspection, fault diagnosis and safe repairs by certified electricians.",
    experience: "8",
    rating: 4.8,
    verified: true,
    price: 799,
    available: true,
    categoryId: 1,
    createdAt: "2025-05-12T10:30:00",
  },
  {
    id: 102,
    providerId: 2,
    providerUserId: 2,
    businessName: "AquaFlow Plumbing",
    title: "Bathroom Leak & Pipe Repair",
    description: "Quick diagnosis and repair of leaks, broken pipes and faucet replacements.",
    experience: "12",
    rating: 4.7,
    verified: true,
    price: 599,
    available: true,
    categoryId: 2,
    createdAt: "2025-05-18T14:15:00",
  },
  {
    id: 103,
    providerId: 3,
    providerUserId: 3,
    businessName: "ColorCraft Painters",
    title: "2 BHK Interior Painting",
    description: "Premium emulsion painting for a 2 BHK including putty, primer and 2 coats.",
    experience: "6",
    rating: 4.9,
    verified: true,
    price: 12999,
    available: true,
    categoryId: 3,
    createdAt: "2025-06-01T09:00:00",
  },
  {
    id: 104,
    providerId: 4,
    providerUserId: 4,
    businessName: "WoodWorks Carpentry",
    title: "Modular Kitchen Carpentry",
    description: "Custom modular kitchen design, fabrication and installation in 7-10 days.",
    experience: "10",
    rating: 4.6,
    verified: true,
    price: 45000,
    available: false,
    categoryId: 4,
    createdAt: "2025-04-22T11:45:00",
  },
  {
    id: 105,
    providerId: 5,
    providerUserId: 5,
    businessName: "SparklePro Cleaning",
    title: "Deep Home Cleaning (3 BHK)",
    description: "Top-to-bottom deep cleaning of a 3 BHK home including kitchen, bathrooms and balcony.",
    experience: "5",
    rating: 4.6,
    verified: true,
    price: 2499,
    available: true,
    categoryId: 5,
    createdAt: "2025-06-10T15:20:00",
  },
  {
    id: 106,
    providerId: 6,
    providerUserId: 6,
    businessName: "Glamour Studio",
    title: "Bridal Makeup & Hair",
    description: "HD bridal makeup, hair styling and draping by senior artists at your venue.",
    experience: "7",
    rating: 4.9,
    verified: true,
    price: 8999,
    available: true,
    categoryId: 6,
    createdAt: "2025-05-30T13:10:00",
  },
  {
    id: 107,
    providerId: 7,
    providerUserId: 7,
    businessName: "CoolBreeze AC Services",
    title: "AC Installation & Gas Refill",
    description: "Installation, gas refill, servicing and repair for all major AC brands.",
    experience: "10",
    rating: 4.8,
    verified: false,
    price: 1499,
    available: true,
    categoryId: 7,
    createdAt: "2025-06-15T16:40:00",
  },
  {
    id: 108,
    providerId: 8,
    providerUserId: 8,
    businessName: "Home Appliance Experts",
    title: "Washing Machine Repair",
    description: "Repair and maintenance for semi-automatic and fully automatic washing machines.",
    experience: "9",
    rating: 4.7,
    verified: true,
    price: 699,
    available: true,
    categoryId: 8,
    createdAt: "2025-06-20T12:00:00",
  },
];
  
export const reviews: Review[] = [
  { id: 1, serviceId: 101, userName: "Rohan Mehta", rating: 5, comment: "Quick response and clean work. Highly recommended.", createdAt: "2025-06-01" },
  { id: 2, serviceId: 101, userName: "Priya Sharma", rating: 4, comment: "Good service, slight delay in arrival but solved the issue well.", createdAt: "2025-06-08" },
  { id: 3, serviceId: 105, userName: "Anita Verma", rating: 5, comment: "Spotless work! Booking again for monthly cleaning.", createdAt: "2025-06-14" },
  { id: 4, serviceId: 107, userName: "Karan Kapoor", rating: 5, comment: "AC cooling is back to brand new. Great crew.", createdAt: "2025-06-20" },
  { id: 5, serviceId: 106, userName: "Sneha Iyer", rating: 5, comment: "My bridal look was perfect — got so many compliments!", createdAt: "2025-06-02" },
];

export const testimonials = [
  { name: "Ananya R.", role: "Homeowner", rating: 5, text: "Found a verified electrician within minutes. Job done same day — incredible service." },
  { name: "Vikram S.", role: "Apartment Owner", rating: 5, text: "Deep cleaning crew was punctual, polite and thorough. Booking experience was smooth." },
  { name: "Meera J.", role: "Bride", rating: 5, text: "Bridal makeup at home saved me so much stress. Stunning results, fair price." },
];
