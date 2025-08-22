import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RefuelEventList from "./RefuelEventList";

jest.mock("../../api/refuelEventsApi", () => ({
  useGetRefuelEventsQuery: () => ({
    data: [
      {
        _id: "1",
        truck_id: { plate_number: "MH01AB1234" },
        fuel_amount: 50,
        fuel_cost: 2500,
        date: "2024-01-01T10:00:00Z",
        location: "Mumbai",
      },
    ],
    isLoading: false,
  }),
  useDeleteRefuelEventMutation: () => [jest.fn()],
}));

// Mock the store to prevent Redux errors
jest.mock("../../app/store", () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe("RefuelEventList", () => {
  test("renders refuel events list", async () => {
    render(<RefuelEventList />);
    expect(await screen.findByText(/refuel events/i)).toBeInTheDocument();
    expect(screen.getByText(/mh01ab1234/i)).toBeInTheDocument();
  });

  test("displays fuel data correctly", () => {
    render(<RefuelEventList />);
    expect(screen.getByText(/50/i)).toBeInTheDocument();
    expect(screen.getByText(/2500/i)).toBeInTheDocument();
    expect(screen.getByText(/mumbai/i)).toBeInTheDocument();
  });

  test("shows add refuel event button", () => {
    render(<RefuelEventList />);
    expect(screen.getByText(/add refuel event/i)).toBeInTheDocument();
  });
});
