import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../app/store";
import Profile from "./Profile";

// Mock toast to prevent side effects
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import { AuthProvider } from "../contexts/AuthContext";

// Stable mock user object to prevent infinite loop
const mockUser = {
  name: "Test User",
  email: "test@example.com",
  role: "driver",
  phone: "1234567890",
  aadhar_number: "1234-5678-9012",
  license_number: "DL123456",
  ownedBy: { name: "Owner Name" },
};

jest.mock("../api/authApi", () => ({
  useGetCurrentUserQuery: () => ({
    data: mockUser,
    isLoading: false,
    error: null,
  }),
  useUpdateProfileMutation: () => [
    jest.fn(() => ({ unwrap: () => Promise.resolve({}) })),
    { isLoading: false },
  ],
  useRegisterMutation: () => [jest.fn(), { isLoading: false }],
  useLoginMutation: () => [jest.fn(), { isLoading: false }],
}));

describe("Profile", () => {
  test("renders profile form with user data", () => {
    render(
      <Provider store={store}>
        <AuthProvider>
          <Profile />
        </AuthProvider>
      </Provider>
    );
    expect(screen.getByLabelText(/Email/i)).toHaveValue("test@example.com");
    expect(screen.getByLabelText(/Role/i)).toHaveValue("driver");
    expect(screen.getAllByLabelText(/Name/i)[0]).toHaveValue("Test User");
    expect(screen.getByLabelText(/Phone Number/i)).toHaveValue("1234567890");
    expect(screen.getByLabelText(/Aadhar Number/i)).toHaveValue(
      "1234-5678-9012"
    );
    expect(screen.getByLabelText(/License Number/i)).toHaveValue("DL123456");
    expect(screen.getByLabelText(/Owner Name/i)).toHaveValue("Owner Name");
  });

  test("submits profile update form", async () => {
    render(
      <Provider store={store}>
        <AuthProvider>
          <Profile />
        </AuthProvider>
      </Provider>
    );
    const nameInput = screen.getAllByLabelText(/Name/i)[0];
    fireEvent.change(nameInput, { target: { value: "Updated User" } });
    const button = screen.getByRole("button", { name: /Update Profile/i });
    await act(async () => {
      fireEvent.click(button);
    });
    expect(button).toBeInTheDocument();
  });
});
