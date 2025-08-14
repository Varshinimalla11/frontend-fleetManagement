import { baseApi } from "./baseApi";

export const refuelEventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRefuelLogsByTrip: builder.query({
      query: (tripId) => `/refuel-events/${tripId}`,
    }),
    logRefuelEvent: builder.mutation({
      query: (eventData) => ({
        url: "/refuel-events",
        method: "POST",
        body: eventData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetRefuelLogsByTripQuery, useLogRefuelEventMutation } =
  refuelEventsApi;
