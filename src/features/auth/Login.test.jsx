import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "./Login";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../app/store"; // <-- corrected import

// Mock useAuth
jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    login: jest
      .fn()
      .mockResolvedValue({ token: "fakeToken", user: { name: "Test User" } }),
  }),
}));

// Mock useNavigate and useLocation
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: { from: { pathname: "/dashboard" } } }),
}));

// Mock toast
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock useForgotPasswordMutation
jest.mock("../../api/authApi", () => ({
  useForgotPasswordMutation: () => [jest.fn()],
}));

describe("Login component", () => {
  it("renders login form and handles submit", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Wait for loading spinner text
    expect(await screen.findByText(/signing in/i)).toBeInTheDocument();
  });
});
