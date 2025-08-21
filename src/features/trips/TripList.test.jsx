import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import TripList from "./TripList";
import { renderWithProviders, mockAuthContext } from "../../utils/testUtils";
import jest from "jest"; // Declare the jest variable

// Mock dependencies
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: "/trips" }),
}));

// Mock moment
jest.mock("moment", () => {
  const actualMoment = jest.requireActual("moment");
  return (date) => actualMoment(date || "2024-01-15T10:00:00Z");
});

// Mock API hooks
const mockTripsQuery = {
  data: [],
  isLoading: false,
  error: null,
  refetch: jest.fn(),
};

const mockMyTripsQuery = {
  data: [],
  isLoading: false,
  error: null,
  refetch: jest.fn(),
};

const mockDeleteTrip = jest.fn();
const mockRestoreTrip = jest.fn();
const mockDashboardStatsQuery = {
  refetch: jest.fn(),
};

jest.mock("../../api/tripsApi", () => ({
  useGetTripsQuery: () => mockTripsQuery,
  useGetMyTripsQuery: () => mockMyTripsQuery,
  useDeleteTripMutation: () => [mockDeleteTrip, { isLoading: false }],
  useRestoreTripMutation: () => [mockRestoreTrip, { isLoading: false }],
}));

jest.mock("../../api/dashboardApi", () => ({
  useGetDashboardStatsQuery: () => mockDashboardStatsQuery,
}));

// Mock React Icons
jest.mock("react-icons/fa", () => ({
  FaEye: ({ className }) => <i className={`fa-eye ${className}`} />,
  FaEdit: ({ className }) => <i className={`fa-edit ${className}`} />,
  FaTrash: ({ className }) => <i className={`fa-trash ${className}`} />,
}));

describe("TripList Component", () => {
  const mockTripsData = [
    {
      _id: "1",
      start_city: "Mumbai",
      end_city: "Delhi",
      truck_id: { plate_number: "MH01AB1234" },
      driver_id: { name: "John Doe" },
      start_time: "2024-01-15T10:00:00Z",
      status: "scheduled",
      isDeleted: false,
    },
    {
      _id: "2",
      start_city: "Pune",
      end_city: "Bangalore",
      truck_id: null,
      driver_id: null,
      start_time: "2024-01-16T08:00:00Z",
      status: "ongoing",
      isDeleted: false,
    },
    {
      _id: "3",
      start_city: "Chennai",
      end_city: "Hyderabad",
      truck_id: { plate_number: "TN02CD5678" },
      driver_id: { name: "Jane Smith" },
      start_time: "2024-01-17T12:00:00Z",
      status: "completed",
      isDeleted: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthContext.user = { _id: "user1", role: "owner", name: "Test User" };
    mockTripsQuery.data = [];
    mockTripsQuery.isLoading = false;
    mockTripsQuery.error = null;
    mockMyTripsQuery.data = [];
    mockMyTripsQuery.isLoading = false;
    mockMyTripsQuery.error = null;
  });

  describe("Loading State", () => {
    test("displays loading spinner when data is loading", () => {
      mockTripsQuery.isLoading = true;
      renderWithProviders(<TripList />);

      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    test("shows loading for driver when myTrips is loading", () => {
      mockAuthContext.user.role = "driver";
      mockMyTripsQuery.isLoading = true;
      renderWithProviders(<TripList />);

      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });

  describe("Component Rendering for Different User Roles", () => {
    test("renders trips list for owner with all controls", () => {
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      expect(screen.getByText("Trips")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /create new trip/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /show deleted trips/i })
      ).toBeInTheDocument();
    });

    test("renders trips list for admin with all controls", () => {
      mockAuthContext.user.role = "admin";
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      expect(
        screen.getByRole("button", { name: /create new trip/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /show deleted trips/i })
      ).toBeInTheDocument();
    });

    test("renders my trips for driver without admin controls", () => {
      mockAuthContext.user.role = "driver";
      mockMyTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      expect(screen.getByText("My Trips")).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /create new trip/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /show deleted trips/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Trips Table Display", () => {
    test("displays trips table with all columns", () => {
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      expect(screen.getByText("Origin")).toBeInTheDocument();
      expect(screen.getByText("Destination")).toBeInTheDocument();
      expect(screen.getByText("Truck")).toBeInTheDocument();
      expect(screen.getByText("Driver")).toBeInTheDocument();
      expect(screen.getByText("Start Date")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Actions")).toBeInTheDocument();
    });

    test("displays trip data correctly", () => {
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      expect(screen.getByText("Mumbai")).toBeInTheDocument();
      expect(screen.getByText("Delhi")).toBeInTheDocument();
      expect(screen.getByText("MH01AB1234")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jan 15, 2024")).toBeInTheDocument();
    });

    test("displays 'Unassigned' for null truck and driver", () => {
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      expect(screen.getAllByText("Unassigned")).toHaveLength(2);
    });

    test("displays status badges with correct variants", () => {
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      const scheduledBadge = screen.getByText("scheduled");
      const ongoingBadge = screen.getByText("ongoing");

      expect(scheduledBadge).toHaveClass("badge", "bg-secondary");
      expect(ongoingBadge).toHaveClass("badge", "bg-primary");
    });
  });

  describe("Show/Hide Deleted Trips Toggle", () => {
    test("toggles between active and deleted trips", async () => {
      const user = userEvent.setup();
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      const toggleButton = screen.getByRole("button", {
        name: /show deleted trips/i,
      });
      await user.click(toggleButton);

      expect(
        screen.getByRole("button", { name: /show active trips/i })
      ).toBeInTheDocument();
      expect(screen.getByText("Deleted Trips")).toBeInTheDocument();
    });

    test("filters trips based on deleted status", async () => {
      const user = userEvent.setup();
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      // Initially shows active trips
      expect(screen.getByText("Mumbai")).toBeInTheDocument();
      expect(screen.queryByText("Chennai")).not.toBeInTheDocument();

      // Toggle to show deleted trips
      const toggleButton = screen.getByRole("button", {
        name: /show deleted trips/i,
      });
      await user.click(toggleButton);

      // Should show deleted trips
      expect(screen.queryByText("Mumbai")).not.toBeInTheDocument();
      expect(screen.getByText("Chennai")).toBeInTheDocument();
    });
  });

  describe("Trip Actions", () => {
    test("displays action buttons for owner/admin", () => {
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      expect(screen.getAllByTitle("View")).toHaveLength(2); // Only non-deleted trips
      expect(screen.getAllByTitle("Edit")).toHaveLength(1); // Only scheduled trip
      expect(screen.getAllByTitle("Delete")).toHaveLength(1); // Only scheduled trip
    });

    test("disables edit/delete buttons for completed/cancelled trips", () => {
      const completedTrip = {
        ...mockTripsData[0],
        status: "completed",
      };
      mockTripsQuery.data = [completedTrip];
      renderWithProviders(<TripList />);

      const editButton = screen.getByTitle("Edit");
      const deleteButton = screen.getByTitle("Delete");

      expect(editButton).toBeDisabled();
      expect(deleteButton).toBeDisabled();
    });

    test("shows restore button for deleted trips", async () => {
      const user = userEvent.setup();
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      // Toggle to show deleted trips
      const toggleButton = screen.getByRole("button", {
        name: /show deleted trips/i,
      });
      await user.click(toggleButton);

      expect(
        screen.getByRole("button", { name: /restore/i })
      ).toBeInTheDocument();
    });
  });

  describe("Delete Trip Functionality", () => {
    test("opens delete confirmation modal", async () => {
      const user = userEvent.setup();
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      const deleteButton = screen.getByTitle("Delete");
      await user.click(deleteButton);

      expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
      expect(
        screen.getByText(
          /are you sure you want to delete this trip from mumbai to delhi/i
        )
      ).toBeInTheDocument();
    });

    test("handles successful trip deletion", async () => {
      const user = userEvent.setup();
      mockDeleteTrip.mockResolvedValue({});
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      const deleteButton = screen.getByTitle("Delete");
      await user.click(deleteButton);

      const confirmButton = screen.getByRole("button", { name: "Delete" });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockDeleteTrip).toHaveBeenCalledWith("1");
      });

      expect(toast.success).toHaveBeenCalledWith("Trip deleted successfully");
      expect(mockDashboardStatsQuery.refetch).toHaveBeenCalled();
    });

    test("handles trip deletion error", async () => {
      const user = userEvent.setup();
      mockDeleteTrip.mockRejectedValue(new Error("Delete failed"));
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      const deleteButton = screen.getByTitle("Delete");
      await user.click(deleteButton);

      const confirmButton = screen.getByRole("button", { name: "Delete" });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Error deleting trip");
      });
    });

    test("cancels delete operation", async () => {
      const user = userEvent.setup();
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      const deleteButton = screen.getByTitle("Delete");
      await user.click(deleteButton);

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      await user.click(cancelButton);

      expect(screen.queryByText("Confirm Delete")).not.toBeInTheDocument();
      expect(mockDeleteTrip).not.toHaveBeenCalled();
    });
  });

  describe("Restore Trip Functionality", () => {
    test("handles successful trip restoration", async () => {
      const user = userEvent.setup();
      mockRestoreTrip.mockResolvedValue({});
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      // Toggle to show deleted trips
      const toggleButton = screen.getByRole("button", {
        name: /show deleted trips/i,
      });
      await user.click(toggleButton);

      const restoreButton = screen.getByRole("button", { name: /restore/i });
      await user.click(restoreButton);

      await waitFor(() => {
        expect(mockRestoreTrip).toHaveBeenCalledWith("3");
      });

      expect(toast.success).toHaveBeenCalledWith("Trip restored!");
      expect(mockDashboardStatsQuery.refetch).toHaveBeenCalled();
    });

    test("handles trip restoration error", async () => {
      const user = userEvent.setup();
      mockRestoreTrip.mockRejectedValue(new Error("Restore failed"));
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      // Toggle to show deleted trips
      const toggleButton = screen.getByRole("button", {
        name: /show deleted trips/i,
      });
      await user.click(toggleButton);

      const restoreButton = screen.getByRole("button", { name: /restore/i });
      await user.click(restoreButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Failed to restore trip");
      });
    });
  });

  describe("Empty States", () => {
    test("displays empty state for no active trips", () => {
      mockTripsQuery.data = [];
      renderWithProviders(<TripList />);

      expect(screen.getByText("No Trips Found")).toBeInTheDocument();
      expect(screen.getByText("No active trips found.")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /create your first trip/i })
      ).toBeInTheDocument();
    });

    test("displays empty state for no deleted trips", async () => {
      const user = userEvent.setup();
      mockTripsQuery.data = [];
      renderWithProviders(<TripList />);

      const toggleButton = screen.getByRole("button", {
        name: /show deleted trips/i,
      });
      await user.click(toggleButton);

      expect(screen.getByText("No deleted trips found.")).toBeInTheDocument();
    });

    test("displays empty state for driver with no assigned trips", () => {
      mockAuthContext.user.role = "driver";
      mockMyTripsQuery.data = [];
      renderWithProviders(<TripList />);

      expect(screen.getByText("No assigned trips found.")).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    test("navigates to create trip page", async () => {
      const user = userEvent.setup();
      mockTripsQuery.data = [];
      renderWithProviders(<TripList />);

      const createButton = screen.getByRole("link", {
        name: /create new trip/i,
      });
      expect(createButton).toHaveAttribute("href", "/trips/new");
    });

    test("navigates to trip details page", () => {
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      const viewButton = screen.getAllByTitle("View")[0];
      expect(viewButton.closest("a")).toHaveAttribute("href", "/trips/1");
    });

    test("navigates to edit trip page", () => {
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      const editButton = screen.getByTitle("Edit");
      expect(editButton.closest("a")).toHaveAttribute("href", "/trips/1/edit");
    });
  });

  describe("Polling and Data Refresh", () => {
    test("refetches data on location change", () => {
      mockAuthContext.user.role = "driver";
      renderWithProviders(<TripList />);

      expect(mockMyTripsQuery.refetch).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    test("has proper table structure", () => {
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getAllByRole("columnheader")).toHaveLength(7);
    });

    test("has proper heading hierarchy", () => {
      renderWithProviders(<TripList />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Trips");
    });

    test("has proper button groups with roles", () => {
      mockTripsQuery.data = mockTripsData;
      renderWithProviders(<TripList />);

      const buttonGroups = screen.getAllByRole("group");
      expect(buttonGroups.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    test("handles trips with missing data gracefully", () => {
      const incompleteTrip = {
        _id: "incomplete",
        start_city: "Test City",
        end_city: "Test Destination",
        truck_id: null,
        driver_id: null,
        start_time: null,
        status: "scheduled",
        isDeleted: false,
      };
      mockTripsQuery.data = [incompleteTrip];
      renderWithProviders(<TripList />);

      expect(screen.getByText("Test City")).toBeInTheDocument();
      expect(screen.getAllByText("Unassigned")).toHaveLength(2);
    });

    test("handles component re-renders", () => {
      mockTripsQuery.data = mockTripsData;
      const { rerender } = renderWithProviders(<TripList />);

      expect(screen.getByText("Mumbai")).toBeInTheDocument();

      rerender(<TripList />);

      expect(screen.getByText("Mumbai")).toBeInTheDocument();
    });
  });
});
