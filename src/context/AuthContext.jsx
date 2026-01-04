import { createContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/apiClient";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const logout = useCallback(async () => {
    try {
      // Call backend logout endpoint
      await apiFetch(`${backendUrl}/auth/logout`, {
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      navigate("/signin", { replace: true });
    }
  }, [backendUrl, navigate]);

  // Check authentication status on mount and periodically
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await apiFetch(`${backendUrl}/auth/status`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth status check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    checkAuthStatus();

    // Check auth status every 5 minutes to detect session changes
    // (e.g., logout from another tab, server-side session invalidation)
    const interval = setInterval(checkAuthStatus, 5 * 60 * 1000);

    // Listen for logout events from apiClient
    const handleLogout = () => {
      logout();
    };
    window.addEventListener("auth:logout", handleLogout);

    return () => {
      clearInterval(interval);
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [checkAuthStatus, logout]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
