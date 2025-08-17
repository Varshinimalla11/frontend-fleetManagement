import { baseApi } from "./baseApi";

export const trucksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrucks: builder.query({
      query: () => "/trucks",
       providesTags: ['Trucks']
    }),
    getTruckById: builder.query({
      query: (id) => `/trucks/${id}`,
       providesTags: (result, error, id) => [{ type: 'Trucks', id }, 'Trucks'],
    }),
    createTruck: builder.mutation({
      query: (newTruck) => ({
        url: "/trucks",
        method: "POST",
        body: newTruck,
      }),
      invalidatesTags: ['Trucks'], 
    }),
    updateTruck: builder.mutation({
      query: ({ id, ...truckData }) => ({
        url: `/trucks/${id}`,
        method: "PUT",
        body: truckData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Trucks', id }, 'Trucks'],
    }),
    deleteTruck: builder.mutation({
      query: (id) => ({
        url: `/trucks/${id}`,
        method: "DELETE",
      }),
       invalidatesTags: (result, error, id) => [{ type: 'Trucks', id }, 'Trucks'],
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
