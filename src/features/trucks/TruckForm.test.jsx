import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import TruckForm from "./TruckForm";

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { role: "owner", _id: "u1" } }),
}));

jest.mock("../../api/trucksApi", () => ({
  useCreateTruckMutation: () => [jest.fn()],
  useUpdateTruckMutation: () => [jest.fn()],
  useGetTruckByIdQuery: () => ({ data: null, isLoading: false }),
}));

// Mock the store to prevent Redux errors
jest.mock("../../app/store", () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe("TruckForm", () => {
  test("renders truck form fields", () => {
    render(
      <MemoryRouter>
        <TruckForm />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/plate number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/capacity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
  });

  test("submits form with truck data", async () => {
    const mockCreateTruck = jest.fn();
    jest
      .spyOn(require("../../api/trucksApi"), "useCreateTruckMutation")
      .mockReturnValue([mockCreateTruck, { isLoading: false }]);

    render(
      <MemoryRouter>
        <TruckForm />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/plate number/i), "MH01AB1234");
    await userEvent.type(screen.getByLabelText(/model/i), "Tata 407");
    await userEvent.type(screen.getByLabelText(/capacity/i), "1.5 ton");
    await userEvent.click(
      screen.getByRole("button", { name: /create truck/i })
    );

    expect(mockCreateTruck).toHaveBeenCalled();
  });

  test("shows validation errors for required fields", async () => {
    render(
      <MemoryRouter>
        <TruckForm />
      </MemoryRouter>
    );

    await userEvent.click(
      screen.getByRole("button", { name: /create truck/i })
    );

    expect(screen.getByText(/plate number is required/i)).toBeInTheDocument();
    expect(screen.getByText(/model is required/i)).toBeInTheDocument();
  });
});
