import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import TruckForm from "./TruckForm";

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { role: "owner", _id: "u1" } }),
}));

jest.mock("../../api/trucksApi", () => ({
  useCreateTruckMutation: () => [jest.fn(), { isLoading: false }],
  useUpdateTruckMutation: () => [jest.fn(), { isLoading: false }],
  useGetTruckByIdQuery: () => ({
    data: {
      _id: "1",
      plate_number: "MH01AB1234",
      model: "Tata 407",
      capacity: "1.5 ton",
      year: "2020",
      condition: "active",
    },
    isLoading: false,
  }),
}));

describe("TruckForm", () => {
  test("renders truck form fields", () => {
    jest
      .spyOn(require("../../api/trucksApi"), "useCreateTruckMutation")
      .mockReturnValue([jest.fn(), { isLoading: false }]);
    jest
      .spyOn(require("../../api/trucksApi"), "useUpdateTruckMutation")
      .mockReturnValue([jest.fn(), { isLoading: false }]);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TruckForm />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByLabelText(/plate number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/condition/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mileage factor/i)).toBeInTheDocument();
  });

  test("submits form with truck data", async () => {
    const mockCreateTruck = jest.fn();
    jest
      .spyOn(require("../../api/trucksApi"), "useCreateTruckMutation")
      .mockReturnValue([mockCreateTruck, { isLoading: false }]);
    jest
      .spyOn(require("../../api/trucksApi"), "useUpdateTruckMutation")
      .mockReturnValue([jest.fn(), { isLoading: false }]);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TruckForm />
        </MemoryRouter>
      </Provider>
    );
    await userEvent.type(screen.getByLabelText(/plate number/i), "MH01AB1234");
    await userEvent.selectOptions(
      screen.getByLabelText(/condition/i),
      "active"
    );
    await userEvent.type(screen.getByLabelText(/mileage factor/i), "10.5");
    await userEvent.click(screen.getByRole("button", { name: /save truck/i }));
    expect(mockCreateTruck).toHaveBeenCalled();
  });

  test("shows validation errors for required fields", async () => {
    jest
      .spyOn(require("../../api/trucksApi"), "useCreateTruckMutation")
      .mockReturnValue([jest.fn(), { isLoading: false }]);
    jest
      .spyOn(require("../../api/trucksApi"), "useUpdateTruckMutation")
      .mockReturnValue([jest.fn(), { isLoading: false }]);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TruckForm />
        </MemoryRouter>
      </Provider>
    );
    await userEvent.click(screen.getByRole("button", { name: /save truck/i }));
    expect(screen.getByLabelText(/plate number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/condition/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mileage factor/i)).toBeInTheDocument();
  });
});
