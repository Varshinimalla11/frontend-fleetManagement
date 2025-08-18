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
          {isAuthenticated ? (
            <Route
              path="/"
              element={
                <ProtectedRoute roles={["owner", "admin", "driver"]}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />

              <Route
                path="invite-driver"
                element={
                  <ProtectedRoute roles={["owner", "admin"]}>
                    <InviteDriver />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-drivers"
                element={
                  <ProtectedRoute roles={["owner", "admin"]}>
                    <MyDrivers />
                  </ProtectedRoute>
                }
              />

              {/* Truck Management - owners/admins only */}
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
              {/* Notifications page */}
              <Route
                path="notifications"
                element={
                  <ProtectedRoute roles={["owner", "admin", "driver"]}>
                    <NotificationsList />
                  </ProtectedRoute>
                }
              />

              {/* 404 for all other authenticated paths */}
              <Route path="*" element={<div>Page Not Found</div>} />
            </Route>
          ) : (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/register-driver"
                element={<RegisterDriverFromInvite />}
              />
            </>
          )}
        </Routes>
      </NotificationProvider>
    </Router>
  );
}

export default App;
