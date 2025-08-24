import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TripDetails from "./TripDetails";

// Mock all the API hooks that TripDetails uses

jest.mock("../../api/tripsApi", () => ({
  useGetTripByIdQuery: () => ({
    data: {
      _id: "1",
      start_city: "Mumbai",
      end_city: "Delhi",
      status: "scheduled",
      start_time: "2024-01-01T10:00:00Z",
      driver_id: { name: "John Driver" },
      truck_id: { plate_number: "MH01AB1234" },
    },
    isLoading: false,
  }),
  useStartTripMutation: () => [jest.fn(), { isLoading: false }],
  useCompleteTripMutation: () => [jest.fn(), { isLoading: false }],
}));

jest.mock("../../api/driveSessionsApi", () => ({
  useGetSessionsByTripQuery: () => ({ data: [], refetch: jest.fn() }),
  useEndDriveSessionAndStartRestMutation: () => [
    jest.fn(),
    { isLoading: false },
  ],
  useStartDriveSessionMutation: () => [jest.fn(), { isLoading: false }],
  useEndDriveSessionMutation: () => [jest.fn(), { isLoading: false }],
}));

jest.mock("../../api/restLogsApi", () => ({
  useGetRestLogsByTripQuery: () => ({ data: [], refetch: jest.fn() }),
  useEndRestAndStartDriveMutation: () => [jest.fn(), { isLoading: false }],
}));

jest.mock("../../api/refuelEventsApi", () => ({
  useGetRefuelLogsByTripQuery: () => ({ data: [], refetch: jest.fn() }),
  useLogRefuelEventMutation: () => [jest.fn(), { isLoading: false }],
}));

jest.mock("../../api/notificationsApi", () => ({
  useGetNotificationsQuery: () => ({
    data: [],
    refetch: jest.fn(),
    isLoading: false,
  }),
}));

// Removed duplicate mock for driveSessionsApi

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { role: "owner", _id: "u1" } }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "1" }),
}));

describe("TripDetails", () => {
  test("renders trip details", async () => {
    render(
      <MemoryRouter>
        <TripDetails />
      </MemoryRouter>
    );
    expect(await screen.findByText(/mumbai/i)).toBeInTheDocument();
    expect(screen.getByText(/delhi/i)).toBeInTheDocument();
    expect(screen.getByText(/scheduled/i)).toBeInTheDocument();
    expect(screen.getByText(/john driver/i)).toBeInTheDocument();
    expect(screen.getByText(/mh01ab1234/i)).toBeInTheDocument();
  });

  test("displays trip information correctly", () => {
    render(
      <MemoryRouter>
        <TripDetails />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/trip/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/mumbai/i)).toBeInTheDocument();
    expect(screen.getByText(/delhi/i)).toBeInTheDocument();
    expect(screen.getByText(/scheduled/i)).toBeInTheDocument();
  });
});
