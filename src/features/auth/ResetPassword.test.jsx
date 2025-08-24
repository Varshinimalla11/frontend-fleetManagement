import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ResetPassword from "./ResetPassword";

jest.mock("../../api/authApi", () => ({
  useResetPasswordMutation: () => [jest.fn(), { isLoading: false }],
  useValidateResetTokenQuery: () => ({
    data: { valid: true },
    isLoading: false,
  }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: () => [new URLSearchParams("?token=reset-token"), jest.fn()],
}));

describe("ResetPassword", () => {
  test("renders reset password form", () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/reset password/i)[0]).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter new password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirm new password/i)
    ).toBeInTheDocument();
  });

  test("submits form with new password", async () => {
    const mockResetPassword = jest.fn();
    jest
      .spyOn(require("../../api/authApi"), "useResetPasswordMutation")
      .mockReturnValue([mockResetPassword, { isLoading: false }]);

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    await userEvent.type(
      screen.getByPlaceholderText(/enter new password/i),
      "newpassword123"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirm new password/i),
      "newpassword123"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /reset password/i })
    );

    expect(mockResetPassword).toHaveBeenCalledWith({
      token: "reset-token",
      newPassword: "newpassword123",
    });
  });

  test("shows validation error for password mismatch", async () => {
    const mockResetPassword = jest.fn();
    jest
      .spyOn(require("../../api/authApi"), "useResetPasswordMutation")
      .mockReturnValue([mockResetPassword, { isLoading: false }]);
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    await userEvent.type(
      screen.getByPlaceholderText(/enter new password/i),
      "password123"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirm new password/i),
      "different123"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /reset password/i })
    );
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });
});
