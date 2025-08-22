import React from "react";
import { render, screen } from "@testing-library/react";
import NotificationsList from "./NotificationList";

jest.mock("../../api/notificationsApi", () => ({
  useGetNotificationsQuery: () => ({
    data: [],
    isLoading: false,
    refetch: jest.fn(),
  }),
  useMarkNotificationAsReadMutation: () => [jest.fn()],
  useMarkAllNotificationsAsReadMutation: () => [jest.fn()],
  useDeleteNotificationMutation: () => [jest.fn()],
}));

// Mock the store to prevent Redux errors
jest.mock("../../app/store", () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe("NotificationsList", () => {
  test("renders empty state", () => {
    render(<NotificationsList />);
    expect(screen.getByText(/no notifications/i)).toBeInTheDocument();
  });
});
