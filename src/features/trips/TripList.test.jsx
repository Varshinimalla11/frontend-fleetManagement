import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TripList from "./TripList";

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { role: "owner", _id: "u1" } }),
}));

jest.mock("../../api/tripsApi", () => ({
  useGetTripsQuery: () => ({
    data: [
      {
        _id: "1",
        start_city: "Mumbai",
        end_city: "Delhi",
        status: "scheduled",
        start_time: "2024-01-01T10:00:00Z",
        driver_id: { name: "John Driver" },
        truck_id: { plate_number: "MH01AB1234" },
      },
    ],
    isLoading: false,
  }),
  useDeleteTripMutation: () => [jest.fn()],
  useRestoreTripMutation: () => [jest.fn()],
  useArchiveTripMutation: () => [jest.fn()],
}));

// Mock the store to prevent Redux errors
jest.mock("../../app/store", () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe("TripList", () => {
  test("renders trip list with data", async () => {
    render(<TripList />);
    expect(await screen.findByText(/mumbai/i)).toBeInTheDocument();
    expect(screen.getByText(/delhi/i)).toBeInTheDocument();
    expect(screen.getByText(/scheduled/i)).toBeInTheDocument();
  });

  test("shows create trip button for owners", () => {
    render(<TripList />);
    expect(screen.getByText(/create trip/i)).toBeInTheDocument();
  });
});
