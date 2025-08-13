import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../../app/baseApi';

export const driveSessionsApi = createApi({
  reducerPath: 'driveSessionsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['DriveSession'],
  endpoints: (builder) => ({
    getDriveSessionsByTrip: builder.query({
      query: (tripId) => `/drive-sessions?trip=${tripId}`,
      providesTags: (result, error, tripId) => [{ type: 'DriveSession', tripId }],
    }),
    startDriveSession: builder.mutation({
      query: (tripId) => ({
        url: `/drive-sessions/start`,
        method: 'POST',
        body: { trip_id: tripId },
      }),
      invalidatesTags: (result, error, tripId) => [{ type: 'DriveSession', tripId }],
    }),
    endDriveSession: builder.mutation({
      query: (sessionId) => ({
        url: `/drive-sessions/end/${sessionId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { tripId }) => [{ type: 'DriveSession', tripId }],
    }),
  }),
});

export const {
  useGetDriveSessionsByTripQuery,
  useStartDriveSessionMutation,
  useEndDriveSessionMutation,
} = driveSessionsApi;
