// src/features/trucks/TruckList.test.jsx
import "@testing-library/jest-dom";

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TruckList from "./TruckList";
import { BrowserRouter } from "react-router-dom";

jest.mock("../../api/trucksApi", () => ({
  useGetTrucksQuery: jest.fn(),
  useDeleteTruckMutation: jest.fn(),
}));

import { useGetTrucksQuery, useDeleteTruckMutation } from "../../api/trucksApi";

describe("TruckList component", () => {
  const mockTrucks = [
    {
      _id: "1",
      plate_number: "ABC123",
      condition: "active",
      mileage_factor: 10000,
    },
    {
      _id: "2",
      plate_number: "XYZ789",
      condition: "inactive",
      mileage_factor: 5000,
    },
  ];

  const mockDeleteTruck = jest.fn();

  beforeEach(() => {
    useGetTrucksQuery.mockReturnValue({
      data: mockTrucks,
      isLoading: false,
      error: false,
    });
    useDeleteTruckMutation.mockReturnValue([
      mockDeleteTruck,
      { isLoading: false },
    ]);
  });

  it("renders trucks list", () => {
    render(
      <BrowserRouter>
        <TruckList />
      </BrowserRouter>
    );
    expect(screen.getByText("ABC123")).toBeInTheDocument();
    expect(screen.getByText("XYZ789")).toBeInTheDocument();
  });

  it("handles delete truck", async () => {
    render(
      <BrowserRouter>
        <TruckList />
      </BrowserRouter>
    );

    fireEvent.click(screen.getAllByRole("button", { name: /delete/i })[0]); // Open delete modal
    fireEvent.click(screen.getByText(/confirm/i)); // Confirm delete

    await waitFor(() => {
      expect(mockDeleteTruck).toHaveBeenCalledWith("1");
    });
  });
});
