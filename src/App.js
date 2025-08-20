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
import ResetPassword from "./features/auth/ResetPassword";
import SendOtpPage from "./features/auth/SendOtpPage";
import VerifyOtpPage from "./features/auth/VerifyOtpPage";

import "./App.css";

function App() {
  const { isAuthenticated, isLoading, isInitializing } = useAuth();

  if (isLoading || isInitializing) {
    return <div>Loading...</div>;
  }

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
