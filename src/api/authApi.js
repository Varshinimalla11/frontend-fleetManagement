import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (user) => ({
        url: "/auth/register",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["DashboardStats"],
    }),
    getCurrentUser: builder.query({
      query: () => "/auth/me",
    }),

    registerDriverFromInvite: builder.mutation({
      query: (data) => ({
        url: "/auth/register-driver",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DashboardStats", "MyDrivers"],
    }),
    getDrivers: builder.query({
      query: () => "/auth/my-drivers", // GET /api/drivers

      providesTags: ["MyDrivers"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useGetDriversQuery,
  useRegisterDriverFromInviteMutation,
} = authApi;
