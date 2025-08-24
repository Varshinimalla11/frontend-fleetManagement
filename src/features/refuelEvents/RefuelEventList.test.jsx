import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RefuelEventList from "./RefuelEventList";

jest.mock("../../api/refuelEventsApi", () => ({
  useGetRefuelEventsByTripQuery: () => ({
    data: [
      {
        _id: "1",
        event_time: "2024-01-01T10:00:00Z",
        fuel_before: 50,
        fuel_added: 20,
        fuel_after: 70,
        payment_mode: "Cash",
      },
    ],
    isLoading: false,
    refetch: jest.fn(),
  }),
  useCreateRefuelEventMutation: () => [jest.fn(), { isLoading: false }],
  useDeleteRefuelEventMutation: () => [jest.fn(), { isLoading: false }],
}));

describe("RefuelEventList", () => {
  test("renders refuel events list", async () => {
    render(<RefuelEventList />);
    expect(await screen.findByText(/refuel events/i)).toBeInTheDocument();
    expect(screen.getByText(/jan 01, 2024/i)).toBeInTheDocument(); // date
    expect(screen.getByText(/50/i)).toBeInTheDocument(); // fuel_before
    expect(screen.getByText(/\+20/i)).toBeInTheDocument(); // fuel_added
    expect(screen.getByText(/70/i)).toBeInTheDocument(); // fuel_after
    expect(screen.getByText(/cash/i)).toBeInTheDocument(); // payment_mode
  });

  test("displays fuel data correctly", () => {
    render(<RefuelEventList />);
    expect(screen.getByText(/50/i)).toBeInTheDocument(); // fuel_before
    expect(screen.getByText(/\+20/i)).toBeInTheDocument(); // fuel_added
    expect(screen.getByText(/70/i)).toBeInTheDocument(); // fuel_after
    expect(screen.getByText(/cash/i)).toBeInTheDocument(); // payment_mode
  });

  test("shows add refuel event button", () => {
    render(<RefuelEventList />);
    expect(screen.getByText(/add refuel event/i)).toBeInTheDocument();
  });
});
