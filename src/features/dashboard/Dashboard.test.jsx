import React from "react";
import { render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import { MemoryRouter } from "react-router-dom";

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

describe("Dashboard", () => {
  test("renders welcome message", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  test("renders dashboard cards", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/total trucks/i)).toBeInTheDocument();
    expect(screen.getByText(/total drivers/i)).toBeInTheDocument();
    expect(screen.getByText(/ongoing trips/i)).toBeInTheDocument();
  });
});
