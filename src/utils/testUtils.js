import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationProvider } from "../contexts/NotificationContext";

// Create a mock store for testing
const createMockStore = () => {
  return configureStore({
    reducer: {
      // Add any reducers your app needs
    },
    preloadedState: {
      // Add any initial state
    },
  });
};

// Custom render function that wraps components with all necessary providers
export const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = createMockStore(),
    route = "/",
    authValue = { user: null, isAuthenticated: false, isLoading: false },
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => {
    return (
      <Provider store={store}>
        <AuthProvider value={authValue}>
          <NotificationProvider>
            <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
          </NotificationProvider>
        </AuthProvider>
      </Provider>
    );
  };

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

// Mock all API hooks to prevent Redux errors
export const mockApiHooks = () => {
  // Mock trips API
  jest.mock("../api/tripsApi", () => ({
    useGetTripsQuery: () => ({ data: [], isLoading: false }),
    useGetTripByIdQuery: () => ({ data: null, isLoading: false }),
    useCreateTripMutation: () => [jest.fn()],
    useUpdateTripMutation: () => [jest.fn()],
    useDeleteTripMutation: () => [jest.fn()],
  }));

  // Mock trucks API
  jest.mock("../api/trucksApi", () => ({
    useGetTrucksQuery: () => ({ data: [], isLoading: false }),
    useGetTruckByIdQuery: () => ({ data: null, isLoading: false }),
    useCreateTruckMutation: () => [jest.fn()],
    useUpdateTruckMutation: () => [jest.fn()],
    useDeleteTruckMutation: () => [jest.fn()],
  }));

  // Mock auth API
  jest.mock("../api/authApi", () => ({
    useLoginMutation: () => [jest.fn()],
    useRegisterMutation: () => [jest.fn()],
    useLogoutMutation: () => [jest.fn()],
    useGetDriversQuery: () => ({ data: [], isLoading: false }),
    useSendOtpMutation: () => [jest.fn()],
    useVerifyOtpMutation: () => [jest.fn()],
    useResetPasswordMutation: () => [jest.fn()],
  }));

  // Mock drive sessions API
  jest.mock("../api/driveSessionsApi", () => ({
    useGetDriveSessionsByTripQuery: () => ({ data: [], isLoading: false }),
    useStartDriveSessionMutation: () => [jest.fn()],
    useEndDriveSessionMutation: () => [jest.fn()],
  }));

  // Mock refuel events API
  jest.mock("../api/refuelEventsApi", () => ({
    useGetRefuelEventsQuery: () => ({ data: [], isLoading: false }),
    useDeleteRefuelEventMutation: () => [jest.fn()],
  }));

  // Mock notifications API
  jest.mock("../api/notificationsApi", () => ({
    useGetNotificationsQuery: () => ({ data: [], isLoading: false }),
    useMarkNotificationAsReadMutation: () => [jest.fn()],
    useMarkAllNotificationsAsReadMutation: () => [jest.fn()],
    useDeleteNotificationMutation: () => [jest.fn()],
  }));

  // Mock invite tokens API
  jest.mock("../api/inviteTokensApi", () => ({
    useSendInviteMutation: () => [jest.fn()],
    useVerifyInviteTokenQuery: () => ({ data: null, isLoading: false }),
    useRegisterDriverFromInviteMutation: () => [jest.fn()],
  }));

  // Mock dashboard API
  jest.mock("../api/dashboardApi", () => ({
    useGetDashboardStatsQuery: () => ({ data: null, isLoading: false }),
    useGetRecentTripsQuery: () => ({ data: [], isLoading: false }),
    useGetRecentDriveSessionsQuery: () => ({ data: [], isLoading: false }),
  }));
};

// Mock contexts
export const mockContexts = () => {
  jest.mock("../contexts/AuthContext", () => ({
    useAuth: () => ({ user: null, isAuthenticated: false, isLoading: false }),
    AuthProvider: ({ children }) => <>{children}</>,
  }));

  jest.mock("../contexts/NotificationContext", () => ({
    useNotification: () => ({
      notifications: [],
      addNotification: jest.fn(),
      removeNotification: jest.fn(),
      clearNotifications: jest.fn(),
    }),
    NotificationProvider: ({ children }) => <>{children}</>,
  }));
};

// Mock React Router
export const mockReactRouter = () => {
  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => jest.fn(),
    useParams: () => ({}),
    useSearchParams: () => [new URLSearchParams(), jest.fn()],
    useLocation: () => ({ pathname: "/" }),
  }));
};

// Setup all mocks
export const setupTestMocks = () => {
  mockApiHooks();
  mockContexts();
  mockReactRouter();
};
