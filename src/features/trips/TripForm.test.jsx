// Mock all RTK Query hooks used in TripForm

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
  useCreateTripMutation: () => [jest.fn(), { isLoading: false }],
  useUpdateTripMutation: () => [jest.fn(), { isLoading: false }],
  useGetTripByIdQuery: () => ({ data: null, isLoading: false }),
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import TripForm from "./TripForm";
import { Provider } from "react-redux";
import { testStore } from "../../app/testStore";

describe("TripForm", () => {
  let mockCreateTrip;
  beforeEach(() => {
    mockCreateTrip = jest.fn();
    jest
      .spyOn(require("../../api/tripsApi"), "useCreateTripMutation")
      .mockReturnValue([mockCreateTrip, { isLoading: false }]);
    jest
      .spyOn(require("../../api/tripsApi"), "useUpdateTripMutation")
      .mockReturnValue([jest.fn(), { isLoading: false }]);
    jest
      .spyOn(require("../../api/tripsApi"), "useGetTripByIdQuery")
      .mockReturnValue({ data: null, isLoading: false });
    jest
      .spyOn(require("../../api/trucksApi"), "useGetTrucksQuery")
      .mockReturnValue({
        data: [{ _id: "1", plate_number: "MH01AB1234", condition: "active" }],
        isLoading: false,
      });
    jest
      .spyOn(require("../../api/authApi"), "useGetDriversQuery")
      .mockReturnValue({
        data: [{ _id: "1", name: "John Driver" }],
        isLoading: false,
      });
  });

  test("renders trip form fields", () => {
    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <TripForm />
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByPlaceholderText(/starting location/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/destination location/i)
    ).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")[0]).toBeInTheDocument(); // truck select
    expect(screen.getAllByRole("combobox")[1]).toBeInTheDocument(); // driver select
  });

  test("submits form with trip data", async () => {
    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <TripForm />
        </MemoryRouter>
      </Provider>
    );
    await userEvent.type(
      screen.getByPlaceholderText(/starting location/i),
      "Mumbai"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/destination location/i),
      "Delhi"
    );
    await userEvent.selectOptions(screen.getAllByRole("combobox")[0], "1"); // truck by value
    await userEvent.selectOptions(
      screen.getAllByRole("combobox")[1],
      "John Driver"
    ); // driver by visible text
    await userEvent.type(screen.getAllByRole("spinbutton")[0], "1000"); // totalKm
    await userEvent.type(screen.getAllByRole("spinbutton")[1], "5000"); // cargoWeight
    await userEvent.type(screen.getAllByRole("spinbutton")[2], "200"); // fuelStart
    // If startDate is required, add: await userEvent.type(screen.getByLabelText(/start date/i), "2023-08-23T10:00");
    await userEvent.click(screen.getByRole("button", { name: /create trip/i }));
    expect(mockCreateTrip).toHaveBeenCalled();
  });

  test("shows validation errors for required fields", async () => {
    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <TripForm />
        </MemoryRouter>
      </Provider>
    );
    await userEvent.click(screen.getByRole("button", { name: /create trip/i }));
    expect(screen.getByText(/please select a driver/i)).toBeInTheDocument();
  });
});
