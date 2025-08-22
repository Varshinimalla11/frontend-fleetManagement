import React from "react";
import { render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { name: "Owner", role: "owner", _id: "u1" } }),
}));

jest.mock("../../api/trucksApi", () => ({
  useGetTrucksQuery: () => ({ data: [{ id: 1 }], isLoading: false }),
}));

jest.mock("../../api/tripsApi", () => ({
  useGetMyTripsQuery: () => ({ data: [], isLoading: false }),
  useGetTripsQuery: () => ({ data: [], isLoading: false }),
}));

jest.mock("../../api/dashboardApi", () => ({
  useGetDashboardStatsQuery: () => ({
    data: { totalTrucks: 1, totalDrivers: 2, ongoingTrips: 0 },
    isLoading: false,
  }),
  useGetRecentTripsQuery: () => ({ data: [], isLoading: false }),
  useGetRecentDriveSessionsQuery: () => ({ data: [], isLoading: false }),
}));

// Mock the store to prevent Redux errors
jest.mock("../../app/store", () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe("Dashboard", () => {
  test("renders welcome message", () => {
    render(<Dashboard />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  test("renders dashboard cards", () => {
    render(<Dashboard />);
    expect(screen.getByText(/total trucks/i)).toBeInTheDocument();
    expect(screen.getByText(/total drivers/i)).toBeInTheDocument();
    expect(screen.getByText(/ongoing trips/i)).toBeInTheDocument();
  });
});
