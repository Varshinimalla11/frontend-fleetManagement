import { baseApi } from "./baseApi";

export const restLogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // End a rest log and start a new drive session
    endRestAndStartDrive: builder.mutation({
      query: ({ rest_id, fuel_at_rest_end }) => ({
        url: `/rest-logs/${rest_id}/end`,
        method: "PUT",
        body: fuel_at_rest_end !== undefined ? { fuel_at_rest_end } : {},
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useEndRestAndStartDriveMutation } = restLogsApi;
