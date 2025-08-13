import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../../app/baseApi';

export const refuelEventsApi = createApi({
  reducerPath: 'refuelEventsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['RefuelEvent'],
  endpoints: (builder) => ({
    getRefuelEventsByTrip: builder.query({
      query: (tripId) => `/refuel-events?trip=${tripId}`,
      providesTags: (result, error, tripId) => [{ type: 'RefuelEvent', tripId }],
    }),
    createRefuelEvent: builder.mutation({
      query: (body) => ({
        url: `/refuel-events`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { trip_id }) => [{ type: 'RefuelEvent', trip_id }],
    }),
    deleteRefuelEvent: builder.mutation({
      query: (id) => ({
        url: `/refuel-events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['RefuelEvent'],
    }),
  }),
});

export const {
  useGetRefuelEventsByTripQuery,
  useCreateRefuelEventMutation,
  useDeleteRefuelEventMutation,
} = refuelEventsApi;
