import { baseApi } from "./baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/dashboard/stats",
    }),
    getRecentTrips: builder.query({
      query: () => "/dashboard/recent-trips",
    }),
    getRecentDriveSessions: builder.query({
      query: () => "/dashboard/recent-drive-sessions",
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRecentTripsQuery,
  useGetRecentDriveSessionsQuery,
} = dashboardApi;
