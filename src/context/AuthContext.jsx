import { createContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const logout = useCallback(async () => {
    try {
      // Call backend logout endpoint
      await fetch(`${backendUrl}/auth/logout`, {
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
      const response = await fetch(`${backendUrl}/auth/status`, {
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

    // Check auth status every 5 minutes
    const interval = setInterval(checkAuthStatus, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkAuthStatus]);

  // Auto-refresh token before it expires
  useEffect(() => {
    if (!isAuthenticated) return;

    // Refresh token every 25 minutes (before 30 min expiry)
    const refreshInterval = setInterval(async () => {
      try {
        const response = await fetch(`${backendUrl}/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          // Token refresh failed, logout user
          logout();
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        logout();
      }
    }, 25 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated, backendUrl, logout]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
