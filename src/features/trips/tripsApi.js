import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../../app/baseApi';

export const tripsApi = createApi({
  reducerPath: 'tripsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Trip'],
  endpoints: (builder) => ({
    getTrips: builder.query({
      query: () => '/trips',
      providesTags: ['Trip'],
    }),
    getTripById: builder.query({
      query: (id) => `/trips/${id}`,
      providesTags: (result, error, id) => [{ type: 'Trip', id }],
    }),
    createTrip: builder.mutation({
      query: (body) => ({
        url: '/trips',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Trip'],
    }),
    deleteTrip: builder.mutation({
      query: (id) => ({
        url: `/trips/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Trip'],
    }),
  }),
});

export const {
  useGetTripsQuery,
  useGetTripByIdQuery,
  useCreateTripMutation,
  useDeleteTripMutation,
} = tripsApi;
