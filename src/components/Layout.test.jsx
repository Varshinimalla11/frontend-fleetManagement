import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";

// Mock child components used by Layout
jest.mock("./Navbar", () => () => <div data-testid="navbar">Navbar</div>);
jest.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { name: "Test", role: "owner" }, logout: jest.fn() }),
}));

const renderWithOutlet = () => {
  return render(
    <MemoryRouter initialEntries={["/app/child"]}>
      <Routes>
        <Route path="/app" element={<Layout />}>
          <Route path="child" element={<div>Child Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe("Layout", () => {
  test("renders Navbar and Outlet content", () => {
    renderWithOutlet();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText(/child content/i)).toBeInTheDocument();
  });
});
