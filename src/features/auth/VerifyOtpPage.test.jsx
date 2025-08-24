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
  useLocation: () => ({ state: { email: "test@example.com" } }),
}));

describe("VerifyOtpPage", () => {
  let mockVerifyOtp;
  beforeEach(() => {
    mockVerifyOtp = jest.fn();
    jest
      .spyOn(require("../../api/authApi"), "useVerifyOtpMutation")
      .mockReturnValue([mockVerifyOtp, { isLoading: false }]);
  });

  test("renders OTP verification form", () => {
    render(
      <MemoryRouter>
        <VerifyOtpPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/verify code/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });

  test("submits form with OTP", async () => {
    render(
      <MemoryRouter>
        <VerifyOtpPage />
      </MemoryRouter>
    );
    const otpInput = screen.getByRole("textbox");
    await userEvent.type(otpInput, "123456");
    await userEvent.click(screen.getByRole("button", { name: /verify code/i }));
    expect(mockVerifyOtp).toHaveBeenCalledWith({
      email: "test@example.com",
      otp: "123456",
    });
  });

  test("submit button is disabled for incomplete OTP", async () => {
    render(
      <MemoryRouter>
        <VerifyOtpPage />
      </MemoryRouter>
    );
    const otpInput = screen.getByRole("textbox");
    await userEvent.type(otpInput, "123");
    const button = screen.getByRole("button", { name: /verify code/i });
    expect(button).toBeDisabled();
  });
});
