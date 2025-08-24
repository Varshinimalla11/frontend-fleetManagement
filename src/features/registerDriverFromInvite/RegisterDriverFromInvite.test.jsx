import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RegisterDriverFromInvite from "./RegisterDriverFromInvite";
import { Provider } from "react-redux";
import { store } from "../../app/store";

const stableVerifyResult = {
  isLoading: false,
  isSuccess: true,
  data: { email: "driver@example.com" },
};
jest.mock("../../api/inviteTokensApi", () => ({
  useVerifyInviteTokenQuery: () => ({
    data: { email: "driver@example.com", name: "John Driver" },
    isLoading: false,
  }),
  useVerifyInviteTokenMutation: () => [jest.fn(), stableVerifyResult],
}));

jest.mock("../../api/authApi", () => ({
  useRegisterDriverFromInviteMutation: () => [jest.fn(), { isLoading: false }],
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ token: "valid-token" }),
  useSearchParams: () => [
    {
      get: (key) => (key === "token" ? "valid-token" : null),
    },
  ],
}));

// Mock the store to prevent Redux errors
// Remove mock for store, use real store

describe("RegisterDriverFromInvite", () => {
  test("renders registration form for invited driver", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterDriverFromInvite />
        </MemoryRouter>
      </Provider>
    );
    expect(await screen.findByText(/driver registration/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/create a strong password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirm your password/i)
    ).toBeInTheDocument();
  });

  test("pre-fills email and allows name entry", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterDriverFromInvite />
        </MemoryRouter>
      </Provider>
    );
    const nameInput = screen.getByPlaceholderText(/enter your full name/i);
    await userEvent.type(nameInput, "John Driver");
    expect(nameInput).toHaveValue("John Driver");
    expect(
      screen.getByPlaceholderText(/enter your phone number/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter 12-digit aadhaar number/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your driving license number/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/create a strong password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirm your password/i)
    ).toBeInTheDocument();
  });

  test("submits form with password data", async () => {
    const mockRegister = jest.fn();
    jest
      .spyOn(
        require("../../api/authApi"),
        "useRegisterDriverFromInviteMutation"
      )
      .mockReturnValue([mockRegister, { isLoading: false }]);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterDriverFromInvite />
        </MemoryRouter>
      </Provider>
    );

    await userEvent.type(
      screen.getByPlaceholderText(/enter your full name/i),
      "John Driver"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/enter your phone number/i),
      "9876543210"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/enter 12-digit aadhaar number/i),
      "123456789012"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/enter your driving license number/i),
      "DL1234567"
    );
    // Simulate token in form data
    const originalGet = Object.getOwnPropertyDescriptor(window, "location");
    Object.defineProperty(window, "location", {
      value: { search: "?token=valid-token" },
      writable: true,
    });
    await userEvent.type(
      screen.getByPlaceholderText(/create a strong password/i),
      "password123"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirm your password/i),
      "password123"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /register as driver/i })
    );

    expect(mockRegister).toHaveBeenCalledTimes(1);
    // Restore window.location
    if (originalGet) Object.defineProperty(window, "location", originalGet);
  });
});
