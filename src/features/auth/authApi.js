// import { createApi } from '@reduxjs/toolkit/query/react';
// import { baseQueryWithAuth } from '../../app/baseApi';

// export const authApi = createApi({
//   reducerPath: 'authApi',
//   baseQuery: baseQueryWithAuth,
//   tagTypes: ['Auth', 'User'],
//   endpoints: (builder) => ({
//     login: builder.mutation({
//       query: (credentials) => ({
//         url: '/auth/login',
//         method: 'POST',
//         body: credentials,
//       }),
//       invalidatesTags: ['Auth'],
//     }),
//     register: builder.mutation({
//       query: (userData) => ({
//         url: '/auth/register',
//         method: 'POST',
//         body: userData,
//       }),
//       invalidatesTags: ['Auth'],
//     }),
//     getCurrentUser: builder.query({
//       query: () => '/auth/me',
//       providesTags: ['User'],
//     }),
//     getDrivers: builder.query({
//       query: () => '/drivers',
//       providesTags: ['User'],
//     }),
//   }),
// });

// export const {
//   useLoginMutation,
//   useRegisterMutation,
//   useGetCurrentUserQuery,
//   useGetDriversQuery,
// } = authApi;
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../../app/baseApi';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    getCurrentUser: builder.query({
      query: () => '/auth/me',
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getDrivers: builder.query({
      query: () => '/users/drivers', // adjust to your backend route
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useGetDriversQuery,
} = authApi;
