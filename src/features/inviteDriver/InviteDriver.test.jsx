import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InviteDriver from "./InviteDriver";

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { name: "Owner", role: "owner" } }),
}));

jest.mock("../../api/inviteTokensApi", () => {
  const sendInviteMock = jest
    .fn()
    .mockReturnValue({ unwrap: () => Promise.resolve() });
  return {
    useSendInviteMutation: () => [sendInviteMock, { isLoading: false }],
    _sendInviteMock: sendInviteMock,
  };
});

// Mock the store to prevent Redux errors
jest.mock("../../app/store", () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe("InviteDriver", () => {
  test("submits form and calls API", async () => {
    render(<InviteDriver />);
    await userEvent.type(screen.getByLabelText(/driver name/i), "John");
    await userEvent.type(
      screen.getByLabelText(/driver email/i),
      "john@example.com"
    );
    await userEvent.click(screen.getByRole("button", { name: /send invite/i }));
    const { _sendInviteMock } = require("../../api/inviteTokensApi");
    expect(_sendInviteMock).toHaveBeenCalledWith({
      name: "John",
      email: "john@example.com",
    });
  });
});
