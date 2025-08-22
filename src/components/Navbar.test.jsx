import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

// Create a simple mock AuthContext provider to inject user and logout
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

// Mock RTK Query hooks used inside Navbar
jest.mock("../api/notificationsApi", () => ({
  useGetNotificationsQuery: () => ({ data: [], refetch: jest.fn() }),
  useMarkAllNotificationsAsReadMutation: () => [
    jest.fn(),
    { isLoading: false },
  ],
}));

jest.mock("../api/authApi", () => ({
  useGetDriversQuery: () => ({ data: [], isLoading: false }),
}));

const renderNavbar = (authValue) => {
  const { AuthProvider } = require("../contexts/AuthContext");
  return render(
    <MemoryRouter>
      <AuthProvider value={authValue}>
        <Navbar />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe("Navbar", () => {
  test("renders login/register when unauthenticated", () => {
    renderNavbar({ user: null, logout: jest.fn() });
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  test("renders owner/admin links when owner user", () => {
    renderNavbar({ user: { name: "Alice", role: "owner" }, logout: jest.fn() });
    expect(screen.getByText(/trucks/i)).toBeInTheDocument();
    expect(screen.getByText(/trips/i)).toBeInTheDocument();
    expect(screen.getByText(/invite\s*driver/i)).toBeInTheDocument();
    expect(screen.getByText(/my drivers/i)).toBeInTheDocument();
  });

  test("renders driver link when driver user", () => {
    renderNavbar({ user: { name: "Bob", role: "driver" }, logout: jest.fn() });
    expect(screen.getByText(/my trips/i)).toBeInTheDocument();
  });

  test("logout triggers logout handler", async () => {
    const logout = jest.fn();
    renderNavbar({ user: { name: "Alice", role: "owner" }, logout });
    // open dropdown by clicking on username
    await userEvent.click(screen.getByText(/alice/i));
    await userEvent.click(screen.getByText(/logout/i));
    expect(logout).toHaveBeenCalled();
  });
});
