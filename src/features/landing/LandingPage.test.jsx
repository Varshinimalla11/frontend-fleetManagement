import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";

const renderWithRouter = (initialEntries = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/send-otp" element={<div>Send OTP Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe("LandingPage", () => {
  test("renders title and tagline", () => {
    renderWithRouter();
    expect(screen.getByText(/fleet flow/i)).toBeInTheDocument();
    expect(
      screen.getByText(/safety\. efficiency\. excellence\./i)
    ).toBeInTheDocument();
  });

  test("navigates to login on Login click", async () => {
    renderWithRouter();
    await userEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  test("navigates to send-otp on Register click", async () => {
    renderWithRouter();
    await userEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(screen.getByText(/send otp page/i)).toBeInTheDocument();
  });
});
