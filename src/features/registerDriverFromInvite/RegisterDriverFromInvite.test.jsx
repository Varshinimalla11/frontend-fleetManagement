import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RegisterDriverFromInvite from "./RegisterDriverFromInvite";

jest.mock("../../api/inviteTokensApi", () => ({
  useVerifyInviteTokenQuery: () => ({
    data: { email: "driver@example.com", name: "John Driver" },
    isLoading: false,
  }),
  useRegisterDriverFromInviteMutation: () => [jest.fn()],
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ token: "valid-token" }),
}));

// Mock the store to prevent Redux errors
jest.mock("../../app/store", () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe("RegisterDriverFromInvite", () => {
  test("renders registration form for invited driver", async () => {
    render(
      <MemoryRouter>
        <RegisterDriverFromInvite />
      </MemoryRouter>
    );
    expect(
      await screen.findByText(/complete your registration/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  test("pre-fills email and name from invite", async () => {
    render(
      <MemoryRouter>
        <RegisterDriverFromInvite />
      </MemoryRouter>
    );
    expect(
      await screen.findByDisplayValue(/driver@example\.com/i)
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue(/john driver/i)).toBeInTheDocument();
  });

  test("submits form with password data", async () => {
    const mockRegister = jest.fn();
    jest
      .spyOn(
        require("../../api/inviteTokensApi"),
        "useRegisterDriverFromInviteMutation"
      )
      .mockReturnValue([mockRegister, { isLoading: false }]);

    render(
      <MemoryRouter>
        <RegisterDriverFromInvite />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      "password123"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /complete registration/i })
    );

    expect(mockRegister).toHaveBeenCalledWith({
      token: "valid-token",
      password: "password123",
      confirmPassword: "password123",
    });
  });
});
