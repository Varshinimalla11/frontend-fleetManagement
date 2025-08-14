import { baseApi } from "./baseApi";

export const tripsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrips: builder.query({
      query: () => "/trips",
    }),
    getTripById: builder.query({
      query: (id) => `/trips/${id}`,
    }),
    createTrip: builder.mutation({
      query: (tripData) => ({
        url: "/trips",
        method: "POST",
        body: tripData,
      }),
    }),
    updateTrip: builder.mutation({
      query: ({ id, ...tripData }) => ({
        url: `/trips/${id}`,
        method: "PUT",
        body: tripData,
      }),
    }),
    deleteTrip: builder.mutation({
      query: (id) => ({
        url: `/trips/${id}`,
        method: "DELETE",
      }),
    }),
    startTrip: builder.mutation({
      query: (id) => ({
        url: `/trips/${id}/start`,
        method: "PATCH",
      }),
    }),
    completeTrip: builder.mutation({
      query: (id) => ({
        url: `/trips/${id}/complete`,
        method: "PUT",
      }),
    }),
    cancelTrip: builder.mutation({
      query: (id) => ({
        url: `/trips/${id}/cancel`,
        method: "PATCH",
      }),
    }),
    restoreTrip: builder.mutation({
      query: (id) => ({
        url: `/trips/${id}/restore`,
        method: "PATCH",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTripsQuery,
  useGetTripByIdQuery,
  useCreateTripMutation,
  useUpdateTripMutation,
  useDeleteTripMutation,
  useStartTripMutation,
  useCompleteTripMutation,
  useCancelTripMutation,
  useRestoreTripMutation,
} = tripsApi;
