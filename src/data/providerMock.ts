import type { BookingStatus, AppNotification } from "./userMock";

export type ProviderProfile = {
  id: number;
  userId: number;
  businessName: string;
  description: string;
  experience: number;
  rating: number;
};

export type ProviderService = {
  id: number;
  title: string;
  description: string;
  price: number;
  categoryId: number;
  providerId: number;
  available: boolean;
  createdAt: string;
};

export type ProviderBooking = {
  id: number;
  userId: number;
  providerId: number;
  serviceId: number;
  serviceTitle: string;
  username: string;
  bookingDate: string;
  bookingTime: string;
  address: string;
  notes: string;
  status: BookingStatus;
  createdAt: string;
  price: number;
};

export type ProviderReview = {
  reviewId: number;
  userId: number;
  userName: string;
  providerId: number;
  serviceId: number;
  serviceTitle: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export const providerProfile: ProviderProfile = {
  id: 1,
  userId: 2001,
  businessName: "BrightSpark Electricals",
  description:
    "Licensed electricians offering residential & commercial wiring, installations, and 24/7 emergency repairs.",
  experience: 8,
  rating: 4.8,
};

export const providerServices: ProviderService[] = [
  { id: 101, title: "Home Electrical Wiring & Repair", description: "Full home wiring inspection, fault diagnosis and safe repairs by certified electricians.", price: 799, categoryId: 1, providerId: 1, available: true, createdAt: "2025-05-12" },
  { id: 109, title: "Ceiling Fan Installation", description: "Installation of new ceiling fans with safe wiring and regulator setup.", price: 299, categoryId: 1, providerId: 1, available: true, createdAt: "2025-06-20" },
  { id: 120, title: "MCB & Switchboard Upgrade", description: "Replace and upgrade old MCBs and switchboards with branded, safer modular units.", price: 1499, categoryId: 1, providerId: 1, available: false, createdAt: "2025-07-02" },
];

export const providerBookings: ProviderBooking[] = [
  { id: 6001, userId: 1001, providerId: 1, serviceId: 101, serviceTitle: "Home Electrical Wiring & Repair", username: "Aarav Mehta", bookingDate: "2026-07-02", bookingTime: "10:30", address: "123, MG Road, Bengaluru", notes: "Living room and kitchen wiring", status: "PENDING", createdAt: "2026-06-24", price: 799 },
  { id: 6002, userId: 1042, providerId: 1, serviceId: 109, serviceTitle: "Ceiling Fan Installation", username: "Priya Sharma", bookingDate: "2026-07-04", bookingTime: "14:00", address: "B-22, Indiranagar, Bengaluru", notes: "2 fans, ceiling height 10ft", status: "PENDING", createdAt: "2026-06-25", price: 598 },
  { id: 6003, userId: 1077, providerId: 1, serviceId: 101, serviceTitle: "Home Electrical Wiring & Repair", username: "Rohit Verma", bookingDate: "2026-07-01", bookingTime: "09:00", address: "Sector 21, Koramangala", notes: "Short circuit issue in bedroom", status: "ACCEPTED", createdAt: "2026-06-22", price: 799 },
  { id: 6004, userId: 1090, providerId: 1, serviceId: 120, serviceTitle: "MCB & Switchboard Upgrade", username: "Sneha Iyer", bookingDate: "2026-06-18", bookingTime: "11:00", address: "HSR Layout, Bengaluru", notes: "", status: "COMPLETED", createdAt: "2026-06-12", price: 1499 },
  { id: 6005, userId: 1102, providerId: 1, serviceId: 109, serviceTitle: "Ceiling Fan Installation", username: "Kabir Nair", bookingDate: "2026-06-10", bookingTime: "16:00", address: "Whitefield, Bengaluru", notes: "1 fan", status: "COMPLETED", createdAt: "2026-06-08", price: 299 },
  { id: 6006, userId: 1131, providerId: 1, serviceId: 101, serviceTitle: "Home Electrical Wiring & Repair", username: "Anita Rao", bookingDate: "2026-06-15", bookingTime: "13:00", address: "JP Nagar, Bengaluru", notes: "Out of station that day", status: "REJECTED", createdAt: "2026-06-14", price: 799 },
  { id: 6007, userId: 1145, providerId: 1, serviceId: 109, serviceTitle: "Ceiling Fan Installation", username: "Vikram Singh", bookingDate: "2026-06-01", bookingTime: "08:00", address: "Marathahalli, Bengaluru", notes: "", status: "CANCELLED", createdAt: "2026-05-25", price: 299 },
];

export const providerReviews: ProviderReview[] = [
  { reviewId: 8001, userId: 1090, userName: "Sneha Iyer", providerId: 1, serviceId: 120, serviceTitle: "MCB & Switchboard Upgrade", rating: 5, comment: "Very professional and clean work. Highly recommend.", createdAt: "2026-06-19" },
  { reviewId: 8002, userId: 1102, userName: "Kabir Nair", providerId: 1, serviceId: 109, serviceTitle: "Ceiling Fan Installation", rating: 4, comment: "Quick installation, slight delay in arrival.", createdAt: "2026-06-11" },
  { reviewId: 8003, userId: 1077, userName: "Rohit Verma", providerId: 1, serviceId: 101, serviceTitle: "Home Electrical Wiring & Repair", rating: 5, comment: "Diagnosed the short circuit issue quickly. Fair price.", createdAt: "2026-06-02" },
  { reviewId: 8004, userId: 1050, userName: "Meera Joshi", providerId: 1, serviceId: 101, serviceTitle: "Home Electrical Wiring & Repair", rating: 4, comment: "Good service, will hire again.", createdAt: "2026-05-28" },
];

export const providerNotifications: AppNotification[] = [
  { id: 9101, userId: 2001, email: "provider@ssf.app", title: "New Booking Request", message: "Aarav Mehta requested Home Electrical Wiring & Repair.", type: "BOOKING_CREATED", status: "SENT", isRead: false, createdAt: "2026-06-24", sentAt: "2026-06-24" },
  { id: 9102, userId: 2001, email: "provider@ssf.app", title: "New Booking Request", message: "Priya Sharma requested Ceiling Fan Installation.", type: "BOOKING_CREATED", status: "SENT", isRead: false, createdAt: "2026-06-25", sentAt: "2026-06-25" },
  { id: 9103, userId: 2001, email: "provider@ssf.app", title: "Review Received", message: "Sneha Iyer left you a 5-star review.", type: "REVIEW_RECEIVED", status: "SENT", isRead: false, createdAt: "2026-06-19", sentAt: "2026-06-19" },
  { id: 9104, userId: 2001, email: "provider@ssf.app", title: "Booking Completed", message: "Booking #6004 was marked as completed.", type: "BOOKING_COMPLETED", status: "SENT", isRead: true, createdAt: "2026-06-18", sentAt: "2026-06-18" },
  { id: 9105, userId: 2001, email: "provider@ssf.app", title: "Welcome Provider", message: "Your provider account is active. Start adding services.", type: "SYSTEM_ALERT", status: "SENT", isRead: true, createdAt: "2026-05-30", sentAt: "2026-05-30" },
];