import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { trucksApi } from "../api/trucksApi";
import jest from "jest";

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      [trucksApi.reducerPath]: trucksApi.reducer,
      auth: (state = { user: null, token: null }, action) => state,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(trucksApi.middleware),
    preloadedState: initialState,
  });
};

export const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = createMockStore(preloadedState),
    route = "/",
    user = null,
    ...renderOptions
  } = {}
) => {
  // Set initial route
  window.history.pushState({}, "Test page", route);

  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export const mockUsers = {
  owner: {
    _id: "owner-id-123",
    name: "John Owner",
    email: "owner@truckfleet.com",
    role: "owner",
    company: "Fleet Management Inc",
    createdAt: "2023-01-01T00:00:00.000Z",
  },
  admin: {
    _id: "admin-id-456",
    name: "Jane Admin",
    email: "admin@truckfleet.com",
    role: "admin",
    company: "Fleet Management Inc",
    createdAt: "2023-01-15T00:00:00.000Z",
  },
  driver: {
    _id: "driver-id-789",
    name: "Bob Driver",
    email: "driver@truckfleet.com",
    role: "driver",
    company: "Fleet Management Inc",
    licenseNumber: "DL123456789",
    createdAt: "2023-02-01T00:00:00.000Z",
  },
};

export const mockTrucks = [
  {
    _id: "1",
    plate_number: "ABC123",
    condition: "active",
    mileage_factor: 10000,
    make: "Ford",
    model: "F-150",
    year: 2022,
    vin: "1FTFW1ET5DFC12345",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    _id: "2",
    plate_number: "XYZ789",
    condition: "maintenance_needed",
    mileage_factor: 15000,
    make: "Chevrolet",
    model: "Silverado",
    year: 2021,
    vin: "1GCUYDED5MZ123456",
    createdAt: "2023-01-02T00:00:00.000Z",
    updatedAt: "2023-01-10T00:00:00.000Z",
  },
  {
    _id: "3",
    plate_number: "DEF456",
    condition: "in_maintenance",
    mileage_factor: 8000,
    make: "Ram",
    model: "1500",
    year: 2023,
    vin: "1C6SRFFT0NN123456",
    createdAt: "2023-01-03T00:00:00.000Z",
    updatedAt: "2023-01-20T00:00:00.000Z",
  },
  {
    _id: "4",
    plate_number: "GHI789",
    condition: "inactive",
    mileage_factor: 20000,
    make: "Toyota",
    model: "Tacoma",
    year: 2020,
    vin: "3TMCZ5AN8LM123456",
    createdAt: "2023-01-04T00:00:00.000Z",
    updatedAt: "2023-01-25T00:00:00.000Z",
  },
];

export const mockApiResponses = {
  getTrucks: {
    success: mockTrucks,
    empty: [],
    loading: undefined,
    error: { message: "Failed to fetch trucks", status: 500 },
    networkError: { message: "Network error", status: 0 },
  },
  getTruckById: {
    success: mockTrucks[0],
    notFound: null,
    loading: undefined,
    error: { message: "Truck not found", status: 404 },
    serverError: { message: "Internal server error", status: 500 },
  },
  createTruck: {
    success: { _id: "new-truck-id", ...mockTrucks[0] },
    validationError: {
      message: "Validation failed",
      status: 400,
      errors: ["Plate number is required", "Condition is required"],
    },
    duplicateError: {
      message: "Truck with this plate number already exists",
      status: 409,
    },
  },
  updateTruck: {
    success: { ...mockTrucks[0], condition: "maintenance_needed" },
    notFound: { message: "Truck not found", status: 404 },
    validationError: {
      message: "Validation failed",
      status: 400,
      errors: ["Invalid condition value"],
    },
  },
  deleteTruck: {
    success: { message: "Truck deleted successfully" },
    notFound: { message: "Truck not found", status: 404 },
    forbidden: { message: "Not authorized to delete this truck", status: 403 },
  },
};

export const mockDashboardStats = {
  totalTrucks: 4,
  activeTrucks: 1,
  maintenanceTrucks: 2,
  inactiveTrucks: 1,
  totalDrivers: 5,
  activeDrivers: 4,
  totalTrips: 25,
  completedTrips: 20,
  pendingTrips: 5,
  monthlyStats: [
    { month: "Jan", trips: 8, revenue: 12000 },
    { month: "Feb", trips: 12, revenue: 18000 },
    { month: "Mar", trips: 5, revenue: 7500 },
  ],
};

export const mockTrips = [
  {
    _id: "trip-1",
    origin: "New York, NY",
    destination: "Boston, MA",
    distance: 215,
    status: "completed",
    truckId: "1",
    driverId: "driver-id-789",
    startDate: "2023-03-01T08:00:00.000Z",
    endDate: "2023-03-01T12:30:00.000Z",
    revenue: 850,
  },
  {
    _id: "trip-2",
    origin: "Boston, MA",
    destination: "Philadelphia, PA",
    distance: 300,
    status: "in_progress",
    truckId: "2",
    driverId: "driver-id-789",
    startDate: "2023-03-02T09:00:00.000Z",
    endDate: null,
    revenue: 1200,
  },
];

export const mockDrivers = [
  {
    _id: "driver-1",
    name: "Mike Johnson",
    email: "mike@truckfleet.com",
    licenseNumber: "DL987654321",
    phone: "+1-555-0123",
    status: "active",
    assignedTruckId: "1",
  },
  {
    _id: "driver-2",
    name: "Sarah Wilson",
    email: "sarah@truckfleet.com",
    licenseNumber: "DL456789123",
    phone: "+1-555-0456",
    status: "active",
    assignedTruckId: null,
  },
];

// Helper to wait for async operations
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

export const waitForAsyncOperation = (timeout = 1000) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

export const simulateDelay = (ms = 100) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const createMockTruckFormData = (overrides = {}) => ({
  plate_number: "TEST123",
  condition: "active",
  mileage_factor: "10000",
  ...overrides,
});

export const createMockUserFormData = (overrides = {}) => ({
  name: "Test User",
  email: "test@example.com",
  password: "password123",
  role: "driver",
  ...overrides,
});

export function createMockLocalStorage() {
  return {
    store: {},
    getItem: jest.fn((key) => mockLocalStorage.store[key] || null),
    setItem: jest.fn((key, value) => {
      mockLocalStorage.store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete mockLocalStorage.store[key];
    }),
    clear: jest.fn(() => {
      mockLocalStorage.store = {};
    }),
  };
}

// Mock sessionStorage implementation
export const mockSessionStorage = {
  store: {},
  getItem: jest.fn((key) => mockSessionStorage.store[key] || null),
  setItem: jest.fn((key, value) => {
    mockSessionStorage.store[key] = value;
  }),
  removeItem: jest.fn((key) => {
    delete mockSessionStorage.store[key];
  }),
  clear: jest.fn(() => {
    mockSessionStorage.store = {};
  }),
};

export const createMockError = (status = 500, message = "Server error") => ({
  status,
  message,
  data: { message },
});

export const createNetworkError = () => ({
  name: "NetworkError",
  message: "Failed to fetch",
});

export const createValidationError = (errors = []) => ({
  status: 400,
  message: "Validation failed",
  data: { message: "Validation failed", errors },
});

export const mockAuthContext = {
  authenticated: {
    user: mockUsers.owner,
    token: "valid-token-123",
    login: jest.fn(),
    logout: jest.fn(),
    loading: false,
  },
  unauthenticated: {
    user: null,
    token: null,
    login: jest.fn(),
    logout: jest.fn(),
    loading: false,
  },
  loading: {
    user: null,
    token: null,
    login: jest.fn(),
    logout: jest.fn(),
    loading: true,
  },
};

export const customMatchers = {
  toHaveValidationError: (received, expectedError) => {
    const pass =
      received.error &&
      received.error.status === 400 &&
      received.error.data.errors.includes(expectedError);

    return {
      pass,
      message: () =>
        pass
          ? `Expected not to have validation error "${expectedError}"`
          : `Expected to have validation error "${expectedError}"`,
    };
  },

  toBeLoadingState: (received) => {
    const pass =
      received.isLoading === true && !received.data && !received.error;

    return {
      pass,
      message: () =>
        pass
          ? "Expected not to be in loading state"
          : "Expected to be in loading state",
    };
  },
};

export const createMockApiState = (overrides = {}) => ({
  data: undefined,
  error: undefined,
  isLoading: false,
  isSuccess: false,
  isError: false,
  ...overrides,
});

export const createSuccessApiState = (data) => ({
  data,
  error: undefined,
  isLoading: false,
  isSuccess: true,
  isError: false,
});

export const createErrorApiState = (error) => ({
  data: undefined,
  error,
  isLoading: false,
  isSuccess: false,
  isError: true,
});

export const createLoadingApiState = () => ({
  data: undefined,
  error: undefined,
  isLoading: true,
  isSuccess: false,
  isError: false,
});

export const mockRouteParams = {
  truckId: "1",
  driverId: "driver-1",
  tripId: "trip-1",
};

export const mockNavigate = jest.fn();
export const mockLocation = {
  pathname: "/trucks",
  search: "",
  hash: "",
  state: null,
};

// Re-export everything from React Testing Library
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
