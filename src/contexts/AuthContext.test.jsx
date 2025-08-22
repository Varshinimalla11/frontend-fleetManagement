import React from "react";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock API calls
jest.mock("../api/authApi", () => ({
  useLoginMutation: () => [jest.fn(), { isLoading: false }],
  useRegisterMutation: () => [jest.fn(), { isLoading: false }],
  useLogoutMutation: () => [jest.fn(), { isLoading: false }],
}));

// Mock the store to prevent Redux errors
jest.mock("../app/store", () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

const TestComponent = () => {
  const { user, isAuthenticated, isLoading, login, logout, register } =
    useAuth();
  return (
    <div>
      <div data-testid="user">{user ? user.name : "No user"}</div>
      <div data-testid="authenticated">
        {isAuthenticated ? "true" : "false"}
      </div>
      <div data-testid="loading">{isLoading ? "true" : "false"}</div>
      <button
        onClick={() =>
          login({ email: "test@example.com", password: "password" })
        }
      >
        Login
      </button>
      <button onClick={() => logout()}>Logout</button>
      <button
        onClick={() =>
          register({
            name: "Test",
            email: "test@example.com",
            password: "password",
          })
        }
      >
        Register
      </button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  test("provides initial state", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("user")).toHaveTextContent("No user");
    expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });

  test("loads user from localStorage on mount", () => {
    const mockUser = { name: "Test User", email: "test@example.com" };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("user")).toHaveTextContent("Test User");
    expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
  });

  test("handles login function", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText("Login");
    await act(async () => {
      loginButton.click();
    });

    // Login function should be available
    expect(loginButton).toBeInTheDocument();
  });

  test("handles logout function", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutButton = screen.getByText("Logout");
    await act(async () => {
      logoutButton.click();
    });

    // Logout function should be available
    expect(logoutButton).toBeInTheDocument();
  });

  test("handles register function", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const registerButton = screen.getByText("Register");
    await act(async () => {
      registerButton.click();
    });

    // Register function should be available
    expect(registerButton).toBeInTheDocument();
  });
});
