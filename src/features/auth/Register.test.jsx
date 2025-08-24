import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Register from "./Register";

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    register: jest.fn(),
    isLoading: false,
  }),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: { email: "john@example.com" } }),
}));

// Mock the store to prevent Redux errors
jest.mock("../../app/store", () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe("Register", () => {
  test("renders registration form", () => {
    jest
      .spyOn(require("../../contexts/AuthContext"), "useAuth")
      .mockReturnValue({
        register: jest.fn(),
        isLoading: false,
      });
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    const passwordFields = screen.getAllByLabelText(/password/i);
    expect(passwordFields[0]).toBeInTheDocument();
    expect(passwordFields[1]).toBeInTheDocument();
  });

  test("submits form with valid data", async () => {
    const mockRegister = jest.fn();
    jest
      .spyOn(require("../../contexts/AuthContext"), "useAuth")
      .mockReturnValue({
        register: mockRegister,
        isLoading: false,
      });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/name/i), "John Doe");
    await userEvent.type(screen.getByLabelText(/phone/i), "1234567890");
    await userEvent.type(screen.getByLabelText(/^password$/i), "password123");
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      "password123"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    expect(mockRegister).toHaveBeenCalledWith({
      name: "John Doe",
      phone: "1234567890",
      password: "password123",
      email: "john@example.com",
    });
  });

  test("shows validation errors for empty fields", async () => {
    jest
      .spyOn(require("../../contexts/AuthContext"), "useAuth")
      .mockReturnValue({
        register: jest.fn(),
        isLoading: false,
      });
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    expect(
      screen.getByText(/password must be at least 6 characters/i)
    ).toBeInTheDocument();
  });
});
