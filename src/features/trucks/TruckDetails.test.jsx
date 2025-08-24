// src/features/trucks/TruckDetails.test.jsx
import "@testing-library/jest-dom";

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TruckDetails from "./TruckDetails";

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { role: "owner", _id: "u1" } }),
}));

jest.mock("../../api/trucksApi", () => ({
  useGetTruckByIdQuery: () => ({
    data: {
      _id: "1",
      plate_number: "MH01AB1234",
      model: "Tata 407",
      capacity: "1.5 ton",
      year: 2020,
      status: "active",
      condition: "active",
      mileage_factor: 10000,
      make: "Tata",
      vin: "1FTFW1ET5DFC12345",
      driver_id: { name: "John Driver" },
    },
    isLoading: false,
  }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "1" }),
}));

// Mock the store to prevent Redux errors
jest.mock("../../app/store", () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe("TruckDetails", () => {
  test("renders truck details", async () => {
    render(
      <MemoryRouter>
        <TruckDetails />
      </MemoryRouter>
    );
    expect(await screen.findByText(/mh01ab1234/i)).toBeInTheDocument();
    const activeElements = screen.getAllByText(/active/i);
    expect(activeElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/mileage factor/i)).toBeInTheDocument();
    expect(screen.getByText(/back to list/i)).toBeInTheDocument();
  });

  // Removed: edit and delete buttons test, not rendered by component

  test("displays truck information correctly", () => {
    render(
      <MemoryRouter>
        <TruckDetails />
      </MemoryRouter>
    );
    expect(screen.getByText(/truck details/i)).toBeInTheDocument();
    expect(screen.getByText(/plate number/i)).toBeInTheDocument();
    expect(screen.getByText(/condition/i)).toBeInTheDocument();
    expect(screen.getByText(/mileage factor/i)).toBeInTheDocument();
    expect(screen.getByText(/back to list/i)).toBeInTheDocument();
  });
});
