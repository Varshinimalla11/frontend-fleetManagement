import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

jest.mock("../contexts/AuthContext", () => {
  const React = require("react");
  const AuthContext = React.createContext();
  return {
    useAuth: () => React.useContext(AuthContext),
    AuthProvider: ({ children, value }) => (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    ),
  };
});

const renderWithAuthAndRoutes = (authValue, routeElement) => {
  const { AuthProvider } = require("../contexts/AuthContext");
  return render(
    <MemoryRouter initialEntries={["/protected"]}>
      <AuthProvider value={authValue}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute roles={["owner", "admin", "driver"]}>
                {routeElement}
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe("ProtectedRoute", () => {
  test("redirects unauthenticated to login", () => {
    renderWithAuthAndRoutes(
      { token: null, user: null, isLoading: false, isInitializing: false },
      <div>Protected Content</div>
    );
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  test("renders loader while initializing", () => {
    renderWithAuthAndRoutes(
      { token: null, user: null, isLoading: true, isInitializing: true },
      <div>Protected Content</div>
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("renders children when authorized", () => {
    renderWithAuthAndRoutes(
      {
        token: "t",
        user: { role: "owner" },
        isLoading: false,
        isInitializing: false,
      },
      <div>Protected Content</div>
    );
    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });

  test("blocks when role not allowed and redirects to dashboard", () => {
    renderWithAuthAndRoutes(
      {
        token: "t",
        user: { role: "guest" },
        isLoading: false,
        isInitializing: false,
      },
      <div>Protected Content</div>
    );
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
});
