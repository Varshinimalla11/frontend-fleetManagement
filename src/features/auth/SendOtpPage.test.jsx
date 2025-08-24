import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SendOtpPage from "./SendOtpPage";

jest.mock("../../api/authApi", () => ({
  useSendOtpMutation: () => [jest.fn(), { isLoading: false }],
}));

describe("SendOtpPage", () => {
  test("renders send OTP form", () => {
    render(
      <MemoryRouter>
        <SendOtpPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/send verification code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send verification code/i })
    ).toBeInTheDocument();
  });

  test("submits form with email", async () => {
    const mockSendOtp = jest.fn();
    jest
      .spyOn(require("../../api/authApi"), "useSendOtpMutation")
      .mockReturnValue([mockSendOtp, { isLoading: false }]);

    render(
      <MemoryRouter>
        <SendOtpPage />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.click(
      screen.getByRole("button", { name: /send verification code/i })
    );

    expect(mockSendOtp).toHaveBeenCalledWith({ email: "test@example.com" });
  });

  test("shows validation error for empty email", async () => {
    const mockSendOtp = jest.fn();
    jest
      .spyOn(require("../../api/authApi"), "useSendOtpMutation")
      .mockReturnValue([mockSendOtp, { isLoading: false }]);

    render(
      <MemoryRouter>
        <SendOtpPage />
      </MemoryRouter>
    );

    await userEvent.click(
      screen.getByRole("button", { name: /send verification code/i })
    );

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });
});
