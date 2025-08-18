import { baseApi } from "./baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/dashboard/stats",
      pollingInterval: 6000,
      providesTags: ["DashboardStats"],
    }),
    getRecentTrips: builder.query({
      query: () => "/dashboard/recent-trips",
      providesTags: ["RecentTrips"],
    }),
    getRecentDriveSessions: builder.query({
      query: () => "/dashboard/recent-drive-sessions",
      providesTags: ["RecentDriveSessions"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRecentTripsQuery,
  useGetRecentDriveSessionsQuery,
} = dashboardApi;
