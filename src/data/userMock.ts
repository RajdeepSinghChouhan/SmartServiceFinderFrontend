export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "REJECTED";

export type Booking = {
  id: number;
  userId: number;
  providerId: number;
  serviceId: number;
  serviceTitle: string;
  providerName: string;
  bookingDate: string;
  bookingTime: string;
  address: string;
  notes: string;
  status: BookingStatus;
  createdAt: string;
  price: number;
};

export type UserReview = {
  reviewId: number;
  userId: number;
  providerId: number;
  serviceId: number;
  serviceTitle: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type NotificationType =
  | "BOOKING_CREATED"
  | "BOOKING_ACCEPTED"
  | "BOOKING_REJECTED"
  | "BOOKING_COMPLETED"
  | "REVIEW_RECEIVED"
  | "SYSTEM_ALERT";

export type AppNotification = {
  id: number;
  userId: number;
  email: string;
  title: string;
  message: string;
  type: NotificationType;
  status: string;
  isRead: boolean;
  createdAt: string;
  sentAt: string;
};

export const mockBookings: Booking[] = [
  { id: 5001, userId: 1001, providerId: 1, serviceId: 101, serviceTitle: "Home Electrical Wiring & Repair", providerName: "BrightSpark Electricals", bookingDate: "2026-07-02", bookingTime: "10:30", address: "123, MG Road, Bengaluru", notes: "Living room and kitchen wiring", status: "PENDING", createdAt: "2026-06-24", price: 799 },
  { id: 5002, userId: 1001, providerId: 4, serviceId: 105, serviceTitle: "Deep Home Cleaning (3 BHK)", providerName: "SparklePro Cleaning", bookingDate: "2026-07-05", bookingTime: "09:00", address: "123, MG Road, Bengaluru", notes: "Please bring eco-friendly products", status: "CONFIRMED", createdAt: "2026-06-22", price: 2499 },
  { id: 5003, userId: 1001, providerId: 5, serviceId: 107, serviceTitle: "Split AC Deep Cleaning", providerName: "CoolBreeze AC Services", bookingDate: "2026-06-18", bookingTime: "16:00", address: "123, MG Road, Bengaluru", notes: "2 split AC units", status: "COMPLETED", createdAt: "2026-06-12", price: 699 },
  { id: 5004, userId: 1001, providerId: 6, serviceId: 111, serviceTitle: "Men's Grooming at Home", providerName: "Glamour Studio at Home", bookingDate: "2026-06-10", bookingTime: "11:00", address: "123, MG Road, Bengaluru", notes: "Haircut + beard trim", status: "COMPLETED", createdAt: "2026-06-08", price: 799 },
  { id: 5005, userId: 1001, providerId: 2, serviceId: 112, serviceTitle: "Geyser Installation & Repair", providerName: "AquaFlow Plumbing", bookingDate: "2026-06-15", bookingTime: "14:00", address: "123, MG Road, Bengaluru", notes: "Old geyser making noise", status: "REJECTED", createdAt: "2026-06-14", price: 549 },
  { id: 5006, userId: 1001, providerId: 3, serviceId: 103, serviceTitle: "2 BHK Interior Painting", providerName: "ColorCraft Painters", bookingDate: "2026-06-01", bookingTime: "08:00", address: "123, MG Road, Bengaluru", notes: "", status: "CANCELLED", createdAt: "2026-05-25", price: 12999 },
];

export const mockUserReviews: UserReview[] = [
  { reviewId: 9001, userId: 1001, providerId: 5, serviceId: 107, serviceTitle: "Split AC Deep Cleaning", rating: 5, comment: "Crew was punctual and very thorough. Cooling improved a lot.", createdAt: "2026-06-19" },
  { reviewId: 9002, userId: 1001, providerId: 6, serviceId: 111, serviceTitle: "Men's Grooming at Home", rating: 4, comment: "Good service overall, slightly delayed arrival.", createdAt: "2026-06-11" },
];

export const mockNotifications: AppNotification[] = [
  { id: 7001, userId: 1001, email: "demo@ssf.app", title: "Booking Confirmed", message: "Your booking for Deep Home Cleaning has been confirmed.", type: "BOOKING_ACCEPTED", status: "SENT", isRead: false, createdAt: "2026-06-24", sentAt: "2026-06-24" },
  { id: 7002, userId: 1001, email: "demo@ssf.app", title: "Booking Completed", message: "Your AC Deep Cleaning booking is marked as completed. Please write a review.", type: "BOOKING_COMPLETED", status: "SENT", isRead: false, createdAt: "2026-06-18", sentAt: "2026-06-18" },
  { id: 7003, userId: 1001, email: "demo@ssf.app", title: "New Booking Placed", message: "We've received your booking request for Home Electrical Wiring.", type: "BOOKING_CREATED", status: "SENT", isRead: true, createdAt: "2026-06-24", sentAt: "2026-06-24" },
  { id: 7004, userId: 1001, email: "demo@ssf.app", title: "Booking Rejected", message: "Unfortunately your Geyser Repair booking was rejected by the provider.", type: "BOOKING_REJECTED", status: "SENT", isRead: false, createdAt: "2026-06-14", sentAt: "2026-06-14" },
  { id: 7005, userId: 1001, email: "demo@ssf.app", title: "Welcome to SSF", message: "Thanks for joining Smart Service Finder. Explore services near you.", type: "SYSTEM_ALERT", status: "SENT", isRead: true, createdAt: "2026-05-30", sentAt: "2026-05-30" },
];