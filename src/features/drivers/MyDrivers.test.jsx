import React from "react";
import { render, screen } from "@testing-library/react";
import MyDrivers from "./MyDrivers";

jest.mock("../../api/authApi", () => ({
  useGetDriversQuery: () => ({ data: [], isLoading: false, isError: false }),
}));

// Mock the store to prevent Redux errors
jest.mock("../../app/store", () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe("MyDrivers", () => {
  test("renders empty state", () => {
    render(<MyDrivers />);
    expect(screen.getByText(/no drivers assigned yet/i)).toBeInTheDocument();
  });
});
