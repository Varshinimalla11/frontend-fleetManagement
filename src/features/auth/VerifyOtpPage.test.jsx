import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import VerifyOtpPage from "./VerifyOtpPage";

jest.mock("../../api/authApi", () => ({
  useVerifyOtpMutation: () => [jest.fn(), { isLoading: false }],
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: () => [
    new URLSearchParams("?email=test@example.com"),
    jest.fn(),
  ],
}));

// Mock the store to prevent Redux errors
jest.mock("../../app/store", () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe("VerifyOtpPage", () => {
  test("renders OTP verification form", () => {
    render(
      <MemoryRouter>
        <VerifyOtpPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/verify otp/i)).toBeInTheDocument();
    expect(
      screen.getByText(/enter the otp sent to test@example\.com/i)
    ).toBeInTheDocument();
  });

  test("submits form with OTP", async () => {
    const mockVerifyOtp = jest.fn();
    jest
      .spyOn(require("../../api/authApi"), "useVerifyOtpMutation")
      .mockReturnValue([mockVerifyOtp, { isLoading: false }]);

    render(
      <MemoryRouter>
        <VerifyOtpPage />
      </MemoryRouter>
    );

    // Find OTP input fields and fill them
    const otpInputs = screen.getAllByRole("textbox");
    await userEvent.type(otpInputs[0], "1");
    await userEvent.type(otpInputs[1], "2");
    await userEvent.type(otpInputs[2], "3");
    await userEvent.type(otpInputs[3], "4");

    await userEvent.click(screen.getByRole("button", { name: /verify otp/i }));

    expect(mockVerifyOtp).toHaveBeenCalledWith({
      email: "test@example.com",
      otp: "1234",
    });
  });

  test("shows validation error for incomplete OTP", async () => {
    render(
      <MemoryRouter>
        <VerifyOtpPage />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /verify otp/i }));

    expect(screen.getByText(/please enter complete otp/i)).toBeInTheDocument();
  });
});
