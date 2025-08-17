import { baseApi } from "./baseApi";

export const tripsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
  
    getTrips: builder.query({
        query: ({ showDeleted } = {}) => {
                let url = "/trips";
                if (showDeleted) url += "?showDeleted=true";
          return url;
        },
      providesTags: ['Trips'],
    }),

    getTripById: builder.query({
      query: (id) => `/trips/${id}`,
      providesTags: (result, error, id) => [{ type: 'Trips', id }],
    }),
    createTrip: builder.mutation({
      query: (tripData) => ({
        url: "/trips",
        method: "POST",
        body: tripData,
      }),
      invalidatesTags: ['Trips', "Dashboard"],
    }),
    updateTrip: builder.mutation({
      query: ({ id, ...tripData }) => ({
        url: `/trips/${id}`,
        method: "PUT",
        body: tripData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Trips', id }, 'Trips'],
    }),
    deleteTrip: builder.mutation({
      query: (id) => ({
        url: `/trips/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Trips', id }, 'Trips'], 
    }),
    startTrip: builder.mutation({
      query: (id) => ({
        url: `/trips/${id}/start`,
        method: "PATCH",
      }),
       invalidatesTags: (result, error, id) => [{ type: 'Trips', id }, 'Trips'],
    }),
    completeTrip: builder.mutation({
      query: ({id, fuel_left}) => ({
        url: `/trips/${id}/complete`,
        method: "PUT",
        body: {fuel_left}
      }),
       invalidatesTags: (result, error, {id}) => [{ type: 'Trips', id }, 'Trips'],
    }),
    cancelTrip: builder.mutation({
      query: (id) => ({
        url: `/trips/${id}/cancel`,
        method: "PATCH",
      }),
       invalidatesTags: (result, error, id) => [{ type: 'Trips', id }, 'Trips'],
    }),
    restoreTrip: builder.mutation({
      query: (id) => ({
        url: `/trips/${id}/restore`,
        method: "PATCH",
      }),
       invalidatesTags: (result, error, id) => [{ type: 'Trips', id }, 'Trips'],
    }),
    getMyTrips: builder.query({
        query: () => "/trips/my-trips",
        providesTags: ['Trips'],
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
  useGetMyTripsQuery
} = tripsApi;
