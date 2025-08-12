import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const driverApi = createApi({
  reducerPath: 'driverApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDriverTrips: builder.query({
      query: () => 'trips/my-trips',  // Adjust to your backend endpoint for driver trips
    }),
    startTrip: builder.mutation({
      query: (tripId) => ({
        url: `trips/${tripId}/start`,
        method: 'PUT',
      }),
    }),
    completeTrip: builder.mutation({
      query: (tripId) => ({
        url: `trips/${tripId}/complete`,
        method: 'PUT',
      }),
    }),
    getDriveSessions: builder.query({
      query: (tripId) => `drive-sessions/trip/${tripId}`,
    }),
    createDriveSession: builder.mutation({
      query: ({ tripId, startTime, endTime, fuelUsed, kmCovered }) => ({
        url: `drive-sessions`,
        method: 'POST',
        body: { trip_id: tripId, start_time: startTime, end_time: endTime, fuel_used: fuelUsed, km_covered: kmCovered },
      }),
    }),
    endDriveSession: builder.mutation({
      query: ({ sessionId, fuelLeft }) => ({
        url: `drive-sessions/${sessionId}/end`,
        method: 'PUT',
        body: { fuel_left: fuelLeft },
      }),
    }),
    endRestAndStartDrive: builder.mutation({
      query: ({ restId, fuelLeft }) => ({
        url: `rest-logs/${restId}/end`,
        method: 'PUT',
        body: { fuel_left: fuelLeft },
      }),
    }),
    getRefuelLogs: builder.query({
      query: (tripId) => `refuel-events/${tripId}`,
    }),
    addRefuelEvent: builder.mutation({
      query: ({ tripId, refuelData }) => ({
        url: 'refuel-events',
        method: 'POST',
        body: { trip_id: tripId, ...refuelData },
      }),
    }),
  }),
});

export const {
  useGetDriverTripsQuery,
  useStartTripMutation,
  useCompleteTripMutation,
  useGetDriveSessionsQuery,
  useCreateDriveSessionMutation,
  useEndDriveSessionMutation,
  useEndRestAndStartDriveMutation,
  useGetRefuelLogsQuery,
  useAddRefuelEventMutation,
} = driverApi;
