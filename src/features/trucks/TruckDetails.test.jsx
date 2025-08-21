// src/features/trucks/TruckDetails.test.jsx
import "@testing-library/jest-dom";

import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TruckDetails from "./TruckDetails";

// Mock the RTK Query hook
jest.mock("../../api/trucksApi", () => ({
  useGetTruckByIdQuery: jest.fn(),
}));

import { useGetTruckByIdQuery } from "../../api/trucksApi";

describe("TruckDetails component", () => {
  it("displays loading spinner when loading", () => {
    useGetTruckByIdQuery.mockReturnValue({
      data: null,
      error: false,
      isLoading: true,
    });
    render(
      <BrowserRouter>
        <TruckDetails />
      </BrowserRouter>
    );
    expect(document.querySelector(".spinner-border")).toBeInTheDocument();
  });

  it("displays error message on error", () => {
    useGetTruckByIdQuery.mockReturnValue({
      data: null,
      error: true,
      isLoading: false,
    });
    render(
      <BrowserRouter>
        <TruckDetails />
      </BrowserRouter>
    );
    expect(
      screen.getByText(/error loading truck details/i)
    ).toBeInTheDocument();
  });

  it("displays truck details when data is loaded", () => {
    const fakeTruck = {
      plate_number: "AB123CD",
      condition: "active",
      mileage_factor: 1234,
    };
    useGetTruckByIdQuery.mockReturnValue({
      data: fakeTruck,
      error: false,
      isLoading: false,
    });
    render(
      <BrowserRouter>
        <TruckDetails />
      </BrowserRouter>
    );
    expect(screen.getByText(fakeTruck.plate_number)).toBeInTheDocument();
    expect(screen.getByText(/active/i)).toBeInTheDocument();
    expect(screen.getByText(fakeTruck.mileage_factor)).toBeInTheDocument();
  });
});
