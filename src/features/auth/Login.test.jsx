import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    login: jest.fn(),
    isLoading: false,
  }),
}));

jest.mock("../../api/authApi", () => ({
  useForgotPasswordMutation: () => [jest.fn(), { isLoading: false }],
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock the store to prevent Redux errors
jest.mock("../../app/store", () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe("Login", () => {
  let mockLogin;
  beforeEach(() => {
    mockLogin = jest.fn();
    jest
      .spyOn(require("../../contexts/AuthContext"), "useAuth")
      .mockReturnValue({
        login: mockLogin,
        isLoading: false,
      });
  });

  test("renders login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test("submits form with valid data", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  test("shows validation errors for empty fields", async () => {
    // Mock login to throw error for this test
    jest
      .spyOn(require("../../contexts/AuthContext"), "useAuth")
      .mockReturnValue({
        login: jest.fn(() => {
          throw { message: "Credentials entered are incorrect" };
        }),
        isLoading: false,
      });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // The component sets a generic error message for empty fields
    expect(
      screen.getByText(/credentials entered are incorrect/i)
    ).toBeInTheDocument();
  });
});
