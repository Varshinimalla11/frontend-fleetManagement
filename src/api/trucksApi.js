import { baseApi } from "./baseApi";

export const trucksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrucks: builder.query({
      query: () => "/trucks",
    }),
    getTruckById: builder.query({
      query: (id) => `/trucks/${id}`,
    }),
    createTruck: builder.mutation({
      query: (newTruck) => ({
        url: "/trucks",
        method: "POST",
        body: newTruck,
      }),
    }),
    updateTruck: builder.mutation({
      query: ({ id, ...truckData }) => ({
        url: `/trucks/${id}`,
        method: "PUT",
        body: truckData,
      }),
    }),
    deleteTruck: builder.mutation({
      query: (id) => ({
        url: `/trucks/${id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTrucksQuery,
  useGetTruckByIdQuery,
  useCreateTruckMutation,
  useUpdateTruckMutation,
  useDeleteTruckMutation,
} = trucksApi;
