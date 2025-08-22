// src/features/trucks/TruckList.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TruckList from "./TruckList";

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { role: "owner", _id: "u1" } }),
}));

jest.mock("../../api/trucksApi", () => ({
  useGetTrucksQuery: () => ({
    data: [
      {
        _id: "1",
        plate_number: "MH01AB1234",
        model: "Tata 407",
        capacity: "1.5 ton",
        status: "active",
        driver_id: { name: "John Driver" },
      },
    ],
    isLoading: false,
  }),
  useDeleteTruckMutation: () => [jest.fn()],
}));

// Mock the store to prevent Redux errors
jest.mock("../../app/store", () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe("TruckList", () => {
  test("renders truck list with data", async () => {
    render(<TruckList />);
    expect(await screen.findByText(/mh01ab1234/i)).toBeInTheDocument();
    expect(screen.getByText(/tata 407/i)).toBeInTheDocument();
    expect(screen.getByText(/1\.5 ton/i)).toBeInTheDocument();
  });

  test("shows create truck button for owners", () => {
    render(<TruckList />);
    expect(screen.getByText(/add truck/i)).toBeInTheDocument();
  });

  test("displays truck status correctly", () => {
    render(<TruckList />);
    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });
});
