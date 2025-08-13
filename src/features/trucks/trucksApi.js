import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../../app/baseApi';

export const trucksApi = createApi({
  reducerPath: 'trucksApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getTrucks: builder.query({
      query: () => '/trucks', // adjust to match your backend endpoint
    }),
  }),
});

export const { useGetTrucksQuery } = trucksApi;
