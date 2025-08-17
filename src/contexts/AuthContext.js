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
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: currentUser,
    isLoading: isFetchingUser,
    refetch,
  } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  const [registerApi, { isLoading: isRegistering }] = useRegisterMutation();
  const [loginApi, { isLoading: isLoggingIn }] = useLoginMutation();

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }  else {
      setUser(null);
    }
  }, [currentUser]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        localStorage.setItem("token", token);
        try {
          await refetch().unwrap();
        } catch (error) {
          console.error("Error fetching user:", error);
          logout();
        }
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, [token, refetch]);

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
