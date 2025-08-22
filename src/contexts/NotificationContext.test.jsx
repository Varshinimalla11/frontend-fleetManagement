import React from "react";
import { render, screen, act } from "@testing-library/react";
import { NotificationProvider, useNotification } from "./NotificationContext";

// Mock the store to prevent Redux errors
jest.mock("../app/store", () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

const TestComponent = () => {
  const {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  } = useNotification();
  return (
    <div>
      <div data-testid="count">{notifications.length}</div>
      <button onClick={() => addNotification("Test message", "success")}>
        Add Success
      </button>
      <button onClick={() => addNotification("Test error", "error")}>
        Add Error
      </button>
      <button onClick={() => removeNotification(0)}>Remove First</button>
      <button onClick={() => clearNotifications()}>Clear All</button>
      {notifications.map((notification, index) => (
        <div key={index} data-testid={`notification-${index}`}>
          {notification.message} - {notification.type}
        </div>
      ))}
    </div>
  );
};

describe("NotificationContext", () => {
  test("provides initial empty notifications", () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  test("adds notifications", async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    const addSuccessButton = screen.getByText("Add Success");
    await act(async () => {
      addSuccessButton.click();
    });

    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(screen.getByTestId("notification-0")).toHaveTextContent(
      "Test message - success"
    );
  });

  test("adds multiple notifications", async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    const addSuccessButton = screen.getByText("Add Success");
    const addErrorButton = screen.getByText("Add Error");

    await act(async () => {
      addSuccessButton.click();
      addErrorButton.click();
    });

    expect(screen.getByTestId("count")).toHaveTextContent("2");
    expect(screen.getByTestId("notification-0")).toHaveTextContent(
      "Test message - success"
    );
    expect(screen.getByTestId("notification-1")).toHaveTextContent(
      "Test error - error"
    );
  });

  test("removes specific notification", async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    const addSuccessButton = screen.getByText("Add Success");
    const addErrorButton = screen.getByText("Add Error");
    const removeButton = screen.getByText("Remove First");

    await act(async () => {
      addSuccessButton.click();
      addErrorButton.click();
    });

    expect(screen.getByTestId("count")).toHaveTextContent("2");

    await act(async () => {
      removeButton.click();
    });

    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(screen.getByTestId("notification-0")).toHaveTextContent(
      "Test error - error"
    );
  });

  test("clears all notifications", async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    const addSuccessButton = screen.getByText("Add Success");
    const addErrorButton = screen.getByText("Add Error");
    const clearButton = screen.getByText("Clear All");

    await act(async () => {
      addSuccessButton.click();
      addErrorButton.click();
    });

    expect(screen.getByTestId("count")).toHaveTextContent("2");

    await act(async () => {
      clearButton.click();
    });

    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });
});
