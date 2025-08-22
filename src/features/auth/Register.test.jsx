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
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
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
    await userEvent.type(screen.getByLabelText(/email/i), "john@example.com");
    await userEvent.type(screen.getByLabelText(/phone/i), "1234567890");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      "password123"
    );
    await userEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(mockRegister).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      password: "password123",
      confirmPassword: "password123",
    });
  });

  test("shows validation errors for empty fields", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/phone is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });
});
