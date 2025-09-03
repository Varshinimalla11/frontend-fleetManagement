import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";

import Navbar from "./components/Navbar";
import Layout from "./components/Layout";
import LandingPage from "./features/landing/LandingPage";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import RegisterDriverFromInvite from "./features/registerDriverFromInvite/RegisterDriverFromInvite";
import Dashboard from "./features/dashboard/Dashboard";
import InviteDriver from "./features/inviteDriver/InviteDriver";
import TruckList from "./features/trucks/TruckList";
import TruckForm from "./features/trucks/TruckForm";
import TruckDetails from "./features/trucks/TruckDetails";
import TripList from "./features/trips/TripList";
import TripForm from "./features/trips/TripForm";
import TripDetails from "./features/trips/TripDetails";
import NotificationsList from "./features/notifications/NotificationList";
import MyDrivers from "./features/drivers/MyDrivers";
import Owners from "./features/owners/Owners";
import ResetPassword from "./features/auth/ResetPassword";
import SendOtpPage from "./features/auth/SendOtpPage";
import VerifyOtpPage from "./features/auth/VerifyOtpPage";
import Profile from "./components/Profile";
// import AdminLayout from "./Admin/AdminLayout";
// import AdminDashboard from "./Admin/features/AdminDashboard";
// import AdminOwners from "./Admin/features/AdminOwners";
// import AdminDrivers from "./Admin/features/AdminDrivers";
// import AdminNotifications from "./Admin/features/AdminNotifications";
// import AdminTrips from "./Admin/features/AdminTrips";
// import AdminTripForm from "./Admin/features/AdminTripForm";
// import AdminTrucks from "./Admin/features/AdminTrucks";

import "./App.css";

function App() {
  const { isAuthenticated, isLoading, isInitializing } = useAuth();

  if (isLoading || isInitializing) {
    return <div>Loading...</div>;
  }
  // const HomeRedirect = () => {
  //   const { user } = useAuth();

  //   if (!user) return <Navigate to="/login" replace />;

  //   if (user.role === "admin")
  //     return <Navigate to="/admin/dashboard" replace />;

  //   if (user.role === "owner") return <Navigate to="/dashboard" replace />;

  //   if (user.role === "driver") return <Navigate to="/dashboard" replace />;

  //   return <Navigate to="/login" replace />;
  // };
  return (
    <Router>
      <NotificationProvider>
        <ToastContainer position="top-center" autoClose={2000} />

        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LandingPage />
              )
            }
            // element={isAuthenticated ? <HomeRedirect /> : <LandingPage />}
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/send-otp"
            element={
              !isAuthenticated ? (
                <SendOtpPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/verify-otp"
            element={
              !isAuthenticated ? (
                <VerifyOtpPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/register"
            element={
              !isAuthenticated ? (
                <Register />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          <Route
            path="/register-driver"
            element={
              !isAuthenticated ? (
                <RegisterDriverFromInvite />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          <Route
            path="/reset-password"
            element={
              !isAuthenticated ? (
                <ResetPassword />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          {/* <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="owners" element={<AdminOwners />} />
            <Route path="drivers" element={<AdminDrivers />} />
            <Route path="trucks" element={<AdminTrucks />} />
            <Route path="trips" element={<AdminTrips />} />
            <Route path="trips/new" element={<AdminTripForm />} />
            <Route path="trips/:id/edit" element={<AdminTripForm />} />
            <Route path="trips/:id" element={<TripDetails />} />
            <Route path="notifications" element={<AdminNotifications />} />
          </Route> */}
          {/* Protected routes (directly under /) */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <ProtectedRoute roles={["owner", "admin", "driver"]}>
                  <Layout />
                </ProtectedRoute>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route path="dashboard" element={<Dashboard />} />

            {/* Invite driver - owner/admin only */}
            <Route
              path="invite-driver"
              element={
                <ProtectedRoute roles={["owner", "admin"]}>
                  <InviteDriver />
                </ProtectedRoute>
              }
            />

            {/* My drivers - owner/admin only */}
            <Route
              path="my-drivers"
              element={
                <ProtectedRoute roles={["owner", "admin"]}>
                  <MyDrivers />
                </ProtectedRoute>
              }
            />

            {/* OWNERS - admin only */}
            <Route
              path="owners"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <Owners />
                </ProtectedRoute>
              }
            />

            {/* Truck Management */}
            <Route
              path="trucks"
              element={
                <ProtectedRoute roles={["owner", "admin"]}>
                  <TruckList />
                </ProtectedRoute>
              }
            />
            <Route
              path="trucks/new"
              element={
                <ProtectedRoute roles={["owner", "admin"]}>
                  <TruckForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="trucks/:id"
              element={
                <ProtectedRoute roles={["owner", "admin"]}>
                  <TruckDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="trucks/:id/edit"
              element={
                <ProtectedRoute roles={["owner", "admin"]}>
                  <TruckForm />
                </ProtectedRoute>
              }
            />

            {/* Trips */}
            <Route
              path="trips"
              element={
                <ProtectedRoute roles={["owner", "admin", "driver"]}>
                  <TripList />
                </ProtectedRoute>
              }
            />
            <Route
              path="trips/new"
              element={
                <ProtectedRoute roles={["owner", "admin"]}>
                  <TripForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="trips/:id"
              element={
                <ProtectedRoute roles={["owner", "admin", "driver"]}>
                  <TripDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="trips/:id/edit"
              element={
                <ProtectedRoute roles={["owner", "admin"]}>
                  <TripForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute roles={["owner", "admin", "driver"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Driver-only routes */}
            <Route element={<ProtectedRoute roles={["driver"]} />}>
              <Route path="my-trips" element={<TripList isDriverView />} />
              <Route path="trips/:id" element={<TripDetails />} />
            </Route>

            {/* Notifications */}
            <Route
              path="notifications"
              element={
                <ProtectedRoute roles={["owner", "admin", "driver"]}>
                  <NotificationsList />
                </ProtectedRoute>
              }
            />

            {/* Catch all inside protected area */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Route>

          {/* Catch all for unauthenticated */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </NotificationProvider>
    </Router>
  );
}

export default App;
