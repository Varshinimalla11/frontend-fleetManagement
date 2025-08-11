import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "bootstrap/dist/css/bootstrap.min.css"
import "react-toastify/dist/ReactToastify.css"
import "@fortawesome/fontawesome-free/css/all.min.css"

import { AuthProvider } from "./contexts/AuthContext"
import { NotificationProvider } from "./contexts/NotificationContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import TruckList from "./pages/TruckList"
import TruckForm from "./pages/TruckForm"
import TruckDetails from "./pages/TruckDetails"
import TripList from "./pages/TripList"
import TripForm from "./pages/TripForm"
import TripDetails from "./pages/TripDetails"
import DriveSessionList from "./pages/DriveSessionList"
import RefuelEventList from "./pages/RefuelEventList"
import NotificationList from "./pages/NotificationList"
import InviteDriver from "./pages/InviteDriver"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="App">
            <Navbar />
            <div className="container-fluid mt-4">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/trucks"
                  element={
                    <ProtectedRoute>
                      <TruckList />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/trucks/new"
                  element={
                    <ProtectedRoute roles={["owner", "admin"]}>
                      <TruckForm />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/trucks/:id/edit"
                  element={
                    <ProtectedRoute roles={["owner", "admin"]}>
                      <TruckForm />
                    </ProtectedRoute>
                  }
                />

                <Route path="/trucks/:id" element={
                  <ProtectedRoute roles={["owner", "admin"]}>
                    <TruckDetails />
                  </ProtectedRoute>} />

                <Route
                  path="/trips"
                  element={
                    <ProtectedRoute>
                      <TripList />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/trips/new"
                  element={
                    <ProtectedRoute roles={["owner", "admin"]}>
                      <TripForm />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/trips/:id"
                  element={
                    <ProtectedRoute>
                      <TripDetails />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/drive-sessions"
                  element={
                    <ProtectedRoute>
                      <DriveSessionList />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/refuel-events"
                  element={
                    <ProtectedRoute>
                      <RefuelEventList />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <NotificationList />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/invite-driver"
                  element={
                    <ProtectedRoute roles={["owner", "admin"]}>
                      <InviteDriver />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
            <ToastContainer position="top-right" autoClose={5000} />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
