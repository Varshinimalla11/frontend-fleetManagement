import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import DriveSessionList from "./DriveSessionList";

jest.mock("../../api/driveSessionsApi", () => ({
  useGetDriveSessionsByTripQuery: () => ({
    data: [
      {
        _id: "1",
        startTime: "2024-01-01T10:00:00Z",
        endTime: "2024-01-01T12:00:00Z",
        status: "completed",
      },
    ],
    isLoading: false,
  }),
  useStartDriveSessionMutation: () => [jest.fn()],
  useEndDriveSessionMutation: () => [jest.fn()],
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ tripId: "trip123" }),
}));

// Mock the store to prevent Redux errors
jest.mock("../../app/store", () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe("DriveSessionList", () => {
  test("renders drive sessions list", async () => {
    render(
      <MemoryRouter>
        <DriveSessionList />
      </MemoryRouter>
    );
    expect(await screen.findByText(/drive sessions/i)).toBeInTheDocument();
    expect(screen.getByText(/start session/i)).toBeInTheDocument();
  });

  test("displays session data correctly", () => {
    render(
      <MemoryRouter>
        <DriveSessionList />
      </MemoryRouter>
    );
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
  });

  test("shows start session button", () => {
    render(
      <MemoryRouter>
        <DriveSessionList />
      </MemoryRouter>
    );
    expect(
      screen.getByRole("button", { name: /start session/i })
    ).toBeInTheDocument();
  });
});
