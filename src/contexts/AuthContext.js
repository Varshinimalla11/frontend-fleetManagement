// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  useGetCurrentUserQuery,
  useRegisterMutation,
  useLoginMutation,
} from "../api/authApi";
import { disconnectSocket } from "../utils/socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  ); // lazy init
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: currentUser,
    isLoading: isFetchingUser,
    refetch,
  } = useGetCurrentUserQuery(undefined, {
    skip: !token, // only skip if no token
  });

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setIsInitializing(false);
    } else if (!isFetchingUser && token) {
      // If token exists but no user, treat as not authenticated
      setUser(null);
      setIsInitializing(false);
    }
  }, [currentUser, isFetchingUser, token]);

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("token");
      setUser(null);
      setIsInitializing(false);
    }
  }, [token]);

  const [registerApi, { isLoading: isRegistering }] = useRegisterMutation();
  const [loginApi, { isLoading: isLoggingIn }] = useLoginMutation();

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const res = await loginApi(credentials).unwrap();
      localStorage.setItem("token", res.token);
      setToken(res.token);
      if (res.user) setUser(res.user);
      return res;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Only registration, no auto-login
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const res = await registerApi(userData).unwrap();
      return res;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
    disconnectSocket();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isInitializing,
        isLoading: isLoading || isFetchingUser || isLoggingIn || isRegistering,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
