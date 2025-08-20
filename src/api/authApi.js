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
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: email,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    validateResetToken: builder.query({
      query: (token) => `/auth/validate-reset-token/${token}`,
    }),
    sendOtp: builder.mutation({
      query: (email) => ({
        url: "/auth/send-otp",
        method: "POST",
        body: email,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
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
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useValidateResetTokenQuery,
  useSendOtpMutation,
  useVerifyOtpMutation,
} = authApi;
