import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
// Mock NotificationProvider to pass children through
jest.mock("./contexts/NotificationContext", () => ({
  NotificationProvider: ({ children }) => <>{children}</>,
}));

// Mock all heavy route components to lightweight stubs
jest.mock("./features/landing/LandingPage", () => () => <div>Landing</div>);
jest.mock("./features/auth/Login", () => () => <div>Login</div>);
jest.mock("./features/auth/Register", () => () => <div>Register</div>);
jest.mock(
  "./features/registerDriverFromInvite/RegisterDriverFromInvite",
  () => () => <div>RegisterDriverFromInvite</div>
);
jest.mock("./features/dashboard/Dashboard", () => () => <div>Dashboard</div>);
jest.mock("./features/inviteDriver/InviteDriver", () => () => (
  <div>InviteDriver</div>
));
jest.mock("./features/trucks/TruckList", () => () => <div>TruckList</div>);
jest.mock("./features/trucks/TruckForm", () => () => <div>TruckForm</div>);
jest.mock("./features/trucks/TruckDetails", () => () => (
  <div>TruckDetails</div>
));
jest.mock("./features/trips/TripList", () => () => <div>TripList</div>);
jest.mock("./features/trips/TripForm", () => () => <div>TripForm</div>);
jest.mock("./features/trips/TripDetails", () => () => <div>TripDetails</div>);
jest.mock("./features/notifications/NotificationList", () => () => (
  <div>Notifications</div>
));
jest.mock("./components/Layout", () => ({ children }) => (
  <div>Layout {children}</div>
));

// Control auth state
jest.mock("./contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const { useAuth } = require("./contexts/AuthContext");

// Avoid nested routers by letting App mount its own Router
// Also, allow path control via history API
const renderAppAt = (path, authValue) => {
  useAuth.mockReturnValue(authValue);
  window.history.pushState({}, "Test", path);
  return render(<App />);
};

describe("App routing", () => {
  test("shows Landing when unauthenticated at /", async () => {
    renderAppAt("/", {
      isAuthenticated: false,
      isLoading: false,
      isInitializing: false,
    });
    expect(await screen.findByText(/landing/i)).toBeInTheDocument();
  });
  test("redirects / to /dashboard when authenticated", async () => {
    renderAppAt("/", {
      isAuthenticated: true,
      isLoading: false,
      isInitializing: false,
    });
    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
  });

  test("renders protected nested route when authenticated", async () => {
    renderAppAt("/trucks", {
      isAuthenticated: true,
      isLoading: false,
      isInitializing: false,
    });
    expect(await screen.findByText(/trucklist/i)).toBeInTheDocument();
  });

  test("unauthenticated navigating to login shows Login", async () => {
    renderAppAt("/login", {
      isAuthenticated: false,
      isLoading: false,
      isInitializing: false,
    });
    expect(await screen.findByText(/login/i)).toBeInTheDocument();
  });
});
