import api from "./axios";
import { API_PATHS } from "../utils/constants";
import { reviews as mockReviews, services as mockServices,} from "../data/mock";
import { mockUserReviews } from "../data/userMock";

export const reviewApi = {
  create: (data: any) => api.post(API_PATHS.review.create, data).then((r) => r.data),
  byProvider: async (
    providerId: number | string
  ) => {
    try {
      const res = await api.get(
        API_PATHS.review.byProvider(providerId)
      );

      return res.data;
    } catch {
      const serviceIds = mockServices
        .filter(
          (s) =>
            s.providerId === Number(providerId)
        )
        .map((s) => s.id);

      return mockReviews.filter((r) =>
        serviceIds.includes(r.serviceId)
      );
    }
  },

  mine: async () => {
    try {
      const res = await api.get(
        API_PATHS.review.mine
      );

      return res.data;
    } catch {
      return mockUserReviews;
    }
  },

  byService: async (
    id: number | string
  ) => {
    try {
      const res = await api.get(
        API_PATHS.review.byService(id)
      );

      return res.data;
    } catch {
      console.warn(
        "Backend unavailable, using mock reviews"
      );

      return mockReviews.filter(
        (r) => r.serviceId === Number(id)
      );
    }
  },

  update: async (
    id: number | string,
    data: any
  ) => {
    try {
      const res = await api.put(
        API_PATHS.review.update(id),
        data
      );

      return res.data;
    } catch {
      return {
        reviewId: id,
        ...data,
        createdAt: new Date().toISOString(),
      };
    }
  },

  remove: async (id: number | string) => {
    try {
      const res = await api.delete(
        API_PATHS.review.delete(id)
      );

      return res.data;
    } catch {
      return {
        success: true,
        reviewId: id,
      };
    }
  },

  averageRating: async (
    providerId: number | string
  ) => {
    try {
      const res = await api.get<number>(
        API_PATHS.review.avg(providerId)
      );

      return res.data;
    } catch {
      const serviceIds = mockServices
        .filter(
          (s) =>
            s.providerId === Number(providerId)
        )
        .map((s) => s.id);

      const ratings = mockReviews
        .filter((r) =>
          serviceIds.includes(r.serviceId)
        )
        .map((r) => r.rating);

      if (!ratings.length) return 0;

      return (
        ratings.reduce(
          (sum, rating) => sum + rating,
          0
        ) / ratings.length
      );
    }
  },

  count: async (
    providerId: number | string
  ) => {
    try {
      const res = await api.get<number>(
        API_PATHS.review.count(providerId)
      );

      return res.data;
    } catch {
      const serviceIds = mockServices
        .filter(
          (s) =>
            s.providerId === Number(providerId)
        )
        .map((s) => s.id);

      return mockReviews.filter((r) =>
        serviceIds.includes(r.serviceId)
      ).length;
    }
  },
};
