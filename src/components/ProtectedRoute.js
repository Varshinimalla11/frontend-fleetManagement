"use client";

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ roles = [], children }) => {
  const { token, user, loading, isInitializing } = useAuth(); // ✅ now includes user
  const location = useLocation();

  if (loading || isInitializing) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Not logged in? Redirect to login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check (if roles are specified)
  if (roles.length > 0 && (!user.role || !roles.includes(user.role?.toLowerCase()))) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Access Denied</h4>
          <p>You don't have permission to access this page.</p>
        </div>
        <Navigate to="/dashboard" replace />
      </div>
    );
  }

  // Render either children (if passed) or Outlet (nested routes)
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
