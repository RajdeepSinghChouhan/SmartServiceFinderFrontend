export type Service = {
  id: number;
  title: string;
  description: string;
  price: number;
  available: boolean;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  providerId: number;
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
  { id: 101, title: "Home Electrical Wiring & Repair", description: "Full home wiring inspection, fault diagnosis and safe repairs by certified electricians.", price: 799, available: true, categoryId: 1, categoryName: "Electrician", createdAt: "2025-05-12", providerId: 1 },
  { id: 102, title: "Bathroom Leak & Pipe Repair", description: "Quick diagnosis and repair of leaks, broken pipes and faucet replacements.", price: 599, available: true, categoryId: 2, categoryName: "Plumber", createdAt: "2025-05-18", providerId: 2 },
  { id: 103, title: "2 BHK Interior Painting", description: "Premium emulsion painting for a 2 BHK including putty, primer and 2 coats.", price: 12999, available: true, categoryId: 3, categoryName: "Painter", createdAt: "2025-06-01", providerId: 3 },
  { id: 104, title: "Modular Kitchen Carpentry", description: "Custom modular kitchen design, fabrication and installation in 7-10 days.", price: 45000, available: false, categoryId: 4, categoryName: "Carpenter", createdAt: "2025-04-22", providerId: 3 },
  { id: 105, title: "Deep Home Cleaning (3 BHK)", description: "Top-to-bottom deep cleaning of a 3 BHK home — kitchen, bathrooms, floors and balcony.", price: 2499, available: true, categoryId: 5, categoryName: "Cleaning", createdAt: "2025-06-10", providerId: 4 },
  { id: 106, title: "Bridal Makeup & Hair", description: "HD bridal makeup, hair styling and draping by senior artists at your venue.", price: 8999, available: true, categoryId: 6, categoryName: "Salon", createdAt: "2025-05-30", providerId: 6 },
  { id: 107, title: "Split AC Deep Cleaning", description: "Jet cleaning of indoor and outdoor units, gas check and performance test.", price: 699, available: true, categoryId: 7, categoryName: "AC Repair", createdAt: "2025-06-15", providerId: 5 },
  { id: 108, title: "Refrigerator Repair", description: "Cooling issues, gas refill, thermostat and compressor repair for all brands.", price: 449, available: true, categoryId: 8, categoryName: "Home Appliances", createdAt: "2025-06-18", providerId: 5 },
  { id: 109, title: "Ceiling Fan Installation", description: "Installation of new ceiling fans with safe wiring and regulator setup.", price: 299, available: true, categoryId: 1, categoryName: "Electrician", createdAt: "2025-06-20", providerId: 1 },
  { id: 110, title: "Sofa & Carpet Shampooing", description: "Professional shampoo cleaning of sofa, carpet and curtains with stain removal.", price: 1299, available: true, categoryId: 5, categoryName: "Cleaning", createdAt: "2025-06-08", providerId: 4 },
  { id: 111, title: "Men's Grooming at Home", description: "Haircut, beard styling, and facial — premium products and trained barbers.", price: 799, available: true, categoryId: 6, categoryName: "Salon", createdAt: "2025-06-12", providerId: 6 },
  { id: 112, title: "Geyser Installation & Repair", description: "Installation, descaling and repair of electric and gas geysers.", price: 549, available: false, categoryId: 2, categoryName: "Plumber", createdAt: "2025-05-25", providerId: 2 },
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
