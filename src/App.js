import React from "react";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";

import Navbar from "./components/Navbar";
import Layout from "./components/Layout";

import Dashboard from "./features/dashboard/Dashboard";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import InviteDriver from "./features/inviteDriver/InviteDriver";
import RegisterDriverFromInvite from "./features/registerDriverFromInvite/RegisterDriverFromInvite";
import TruckDetails from "./features/trucks/TruckDetails";
import TruckForm from "./features/trucks/TruckForm";
import TruckList from "./features/trucks/TruckList";
import TripDetails from "./features/trips/TripDetails";
import TripForm from "./features/trips/TripForm";
import TripList from "./features/trips/TripList";
import NotificationsList from "./features/notifications/NotificationList";

import "./App.css";

function App() {
  return (
    <Router>
       <AuthProvider>
      <NotificationProvider>
       
          <ToastContainer position="top-center" autoClose={2000} />
          <Routes>

            {/* PUBLIC ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Invite-based driver registration */}
            <Route path="/register-driver" element={<RegisterDriverFromInvite />} />

            {/* PROTECTED ROUTES (with Layout wrapper) */}
            <Route
              path="/"
              element={
                <ProtectedRoute roles={["owner", "admin", "driver"]}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Nested protected routes appear INSIDE Layout when authenticated */}

              {/* Default: Redirect / to dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* Dashboard (all authenticated users) */}
              <Route path="dashboard" element={<Dashboard />} />

              {/* Only owners/admins: Invite Driver */}
              <Route
                path="invite-driver"
                element={
                  <ProtectedRoute roles={["owner", "admin"]}>
                    <InviteDriver />
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
               <Route path="trucks/:id/edit" 
               element={
                    <ProtectedRoute roles={["owner", "admin"]}>
                      <TruckForm />
                    </ProtectedRoute>
                  } />
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

            {/* Catch-all 404 for unauthenticated paths */}
            <Route path="*" element={<Navigate to="/login" replace />} />

          </Routes>
        
      </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;


// function App() {
//   return (
//     <AuthProvider>
//       <NotificationProvider>
//         <Router>
//           <div className="App">
//             <Navbar />
//             <NotificationToast />
//             <div className="container-fluid mt-4">
//               <Routes>
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
//                 <Route
//                   path="/"
//                   element={<Navigate to="/dashboard" replace />}
//                 />
//                 <Route path="/register-driver" element={<RegisterDriver />} />
//                 <Route
//                   path="/dashboard"
//                   element={
//                     <ProtectedRoute>
//                       <Dashboard />
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/trucks"
//                   element={
//                     <ProtectedRoute>
//                       <TruckList />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Routes>
//                   {/* Owner/Admin only */}
//                   <Route
//                     path="/invite-driver"
//                     element={
//                       <ProtectedRoute>
//                         <InviteDriver />
//                       </ProtectedRoute>
//                     }
//                   />

//                   {/* Driver registration via invite */}
//                   <Route
//                     path="/register-driver/:token"
//                     element={<RegisterDriverFromInvite />}
//                   />
//                 </Routes>
//                 <Route
//                   path="/trucks/new"
//                   element={
//                     <ProtectedRoute roles={["owner", "admin"]}>
//                       <TruckForm />
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/trucks/:id/edit"
//                   element={
//                     <ProtectedRoute roles={["owner", "admin"]}>
//                       <TruckForm />
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/trucks/:id"
//                   element={
//                     <ProtectedRoute roles={["owner", "admin"]}>
//                       <TruckDetails />
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/trips"
//                   element={
//                     <ProtectedRoute>
//                       <TripList />
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/trips/new"
//                   element={
//                     <ProtectedRoute roles={["owner", "admin"]}>
//                       <TripForm />
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/trips/:id"
//                   element={
//                     <ProtectedRoute>
//                       <TripDetails />
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/drive-sessions"
//                   element={
//                     <ProtectedRoute>
//                       <DriveSessionList />
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/refuel-events"
//                   element={
//                     <ProtectedRoute>
//                       <RefuelEventList />
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/notifications"
//                   element={
//                     <ProtectedRoute>
//                       <NotificationList />
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/invite-driver"
//                   element={
//                     <ProtectedRoute roles={["owner", "admin"]}>
//                       <InviteDriver />
//                     </ProtectedRoute>
//                   }
//                 />
//               </Routes>
//             </div>
//             <ToastContainer position="top-right" autoClose={5000} />
//           </div>
//         </Router>
//       </NotificationProvider>
//     </AuthProvider>
//   );
// }

// export default App;
