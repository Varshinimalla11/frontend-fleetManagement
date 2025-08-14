import { baseApi } from "./baseApi";

export const driveSessionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1️⃣ Get all drive sessions for a specific trip
    getSessionsByTrip: builder.query({
      query: (tripId) => `/drive-sessions/trip/${tripId}`,
    }),

    // 2️⃣ End a drive session and start rest
    endDriveSessionAndStartRest: builder.mutation({
      query: ({ session_id, fuel_left }) => ({
        url: `/drive-sessions/${session_id}/end`,
        method: "PUT", // backend expects PUT here
        body: { fuel_left },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSessionsByTripQuery,
  useEndDriveSessionAndStartRestMutation,
} = driveSessionsApi;
