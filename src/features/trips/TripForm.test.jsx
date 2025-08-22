import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import TripForm from "./TripForm";

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { role: "owner", _id: "u1" } }),
}));

jest.mock("../../api/trucksApi", () => ({
  useGetTrucksQuery: () => ({
    data: [{ _id: "1", plate_number: "MH01AB1234" }],
    isLoading: false,
  }),
}));

jest.mock("../../api/authApi", () => ({
  useGetDriversQuery: () => ({
    data: [{ _id: "1", name: "John Driver" }],
    isLoading: false,
  }),
}));

jest.mock("../../api/tripsApi", () => ({
  useCreateTripMutation: () => [jest.fn()],
  useUpdateTripMutation: () => [jest.fn()],
  useGetTripByIdQuery: () => ({ data: null, isLoading: false }),
}));

// Mock the store to prevent Redux errors
jest.mock("../../app/store", () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe("TripForm", () => {
  test("renders trip form fields", () => {
    render(
      <MemoryRouter>
        <TripForm />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/start city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/truck/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/driver/i)).toBeInTheDocument();
  });

  test("submits form with trip data", async () => {
    const mockCreateTrip = jest.fn();
    jest
      .spyOn(require("../../api/tripsApi"), "useCreateTripMutation")
      .mockReturnValue([mockCreateTrip, { isLoading: false }]);

    render(
      <MemoryRouter>
        <TripForm />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/start city/i), "Mumbai");
    await userEvent.type(screen.getByLabelText(/end city/i), "Delhi");
    await userEvent.click(screen.getByRole("button", { name: /create trip/i }));

    expect(mockCreateTrip).toHaveBeenCalled();
  });

  test("shows validation errors for required fields", async () => {
    render(
      <MemoryRouter>
        <TripForm />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /create trip/i }));

    expect(screen.getByText(/start city is required/i)).toBeInTheDocument();
    expect(screen.getByText(/end city is required/i)).toBeInTheDocument();
  });
});
