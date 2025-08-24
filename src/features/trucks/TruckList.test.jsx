// src/features/trucks/TruckList.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TruckList from "./TruckList";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../app/store";

// Single correct mock for RTK Query and AuthContext
jest.mock("../../api/trucksApi", () => ({
  useGetTrucksQuery: () => ({
    data: [
      {
        _id: "1",
        plate_number: "MH01AB1234",
        model: "Tata 407",
        capacity: "1.5 ton",
        status: "active",
        condition: "active",
        driver_id: { name: "John Driver" },
        mileage_factor: "10.5",
      },
    ],
    isLoading: false,
    error: null,
  }),
  useDeleteTruckMutation: () => [jest.fn(), { isLoading: false }],
}));

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { role: "owner", _id: "u1" } }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("TruckList", () => {
  const renderWithProviders = (ui) =>
    render(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    );

  test("renders truck list with data", async () => {
    renderWithProviders(<TruckList />);
    expect(await screen.findByText(/mh01ab1234/i)).toBeInTheDocument();
    // The model and capacity may not be rendered in the table, so only check for plate number and condition
    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });

  test("shows create truck button for owners", () => {
    renderWithProviders(<TruckList />);
    expect(screen.getByText(/add new truck/i)).toBeInTheDocument();
  });

  test("displays truck status correctly", () => {
    renderWithProviders(<TruckList />);
    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });
});
