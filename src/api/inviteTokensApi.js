import { baseApi } from "./baseApi";

export const inviteTokensApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyInviteToken: builder.mutation({
      query: (data) => ({
        url: "/invitetokens/verify",
        method: "POST",
        body: data,
      }),
    }),
    sendInvite: builder.mutation({
      query: (inviteData) => ({
        url: "/invitetokens/send",
        method: "POST",
        body: inviteData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useVerifyInviteTokenMutation, useSendInviteMutation } =
  inviteTokensApi;
