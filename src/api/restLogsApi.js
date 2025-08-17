import { baseApi } from "./baseApi";

export const restLogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRestLogsByTrip: builder.query({
      query: (tripId) => `/rest-logs/trip/${tripId}`,
      providesTags: (result, error, tripId) =>
        result ? 
          [...result.map(({ _id }) => ({ type: "RestLog", id: _id })), { type: "RestLog", id: `TRIP_${tripId}` }] : 
          [{ type: "RestLog", id: `TRIP_${tripId}` }],
    }),
    
    endRestAndStartDrive: builder.mutation({
      query: ({ rest_id, fuel_at_rest_end }) => ({
        url: `/rest-logs/${rest_id}/end`,
        method: "PUT",
        body: fuel_at_rest_end !== undefined ? { fuel_at_rest_end } : {},
      }),
      invalidatesTags: (result, error, { rest_id }) => [{ type: "RestLog", id: rest_id }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetRestLogsByTripQuery, useEndRestAndStartDriveMutation } = restLogsApi;
