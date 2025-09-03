import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOwners: builder.query({
      query: () => "/auth/owners",
      providesTags: ["Owners"],
    }),
  }),
});

export const { useGetOwnersQuery } = adminApi;
