// src/features/auth/Login.test.jsx
import "@testing-library/jest-dom";

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "./Login";
import { BrowserRouter } from "react-router-dom";

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    login: jest
      .fn()
      .mockResolvedValue({ token: "fakeToken", user: { name: "Test User" } }),
  }),
}));

describe("Login component", () => {
  it("renders login form and handles submit", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/logging in/i)).toBeInTheDocument();
  });
});
