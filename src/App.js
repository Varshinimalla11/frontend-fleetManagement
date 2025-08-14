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
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Layout from "./components/Layout";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import RegisterDriverFromInvite from "./features/registerDriverFromInvite/RegisterDriverFromInvite";
import Dashboard from "./features/dashboard/Dashboard";
import InviteDriver from "./features/inviteDriver/InviteDriver";
import TruckDetails from "./features/trucks/TruckDetails";
import TruckForm from "./features/trucks/TruckForm";
import TruckList from "./features/trucks/TruckList";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <ToastContainer position="top-right" autoClose={3000} />

          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/register-driver"
              element={<RegisterDriverFromInvite />}
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Owner/Admin only */}
                <Route element={<ProtectedRoute roles={["owner", "admin"]} />}>
                  <Route path="/invite-driver" element={<InviteDriver />} />
                </Route>

                <Route element={<ProtectedRoute roles={["owner", "admin"]} />}>
                  <Route path="/trucks" element={<TruckList />} />
                  <Route path="/trucks/new" element={<TruckForm />} />
                  <Route path="/trucks/:id" element={<TruckDetails />} />
                  <Route path="/trucks/:id/edit" element={<TruckForm />} />
                </Route>
              </Route>
            </Route>
            {/* Catch-all 404 */}
            <Route
              path="*"
              element={<div className="p-5">Page Not Found</div>}
            />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
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
