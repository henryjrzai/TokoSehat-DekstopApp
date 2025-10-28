import React, { useState, useEffect, ReactNode } from "react";
import {
  login as loginService,
  logout as logoutService,
  isAuthenticated,
  getUserData,
} from "../services/authService";
import type { LoginRequest, UserData } from "../services/authService";
import { AuthContext } from "./AuthContextDef";
import type { AuthContextType } from "./AuthContextDef";

// Props untuk AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check authentication saat pertama kali load
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);

      if (authenticated) {
        const userData = getUserData();
        setUser(userData);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Function untuk login
  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      const response = await loginService(credentials);

      setIsAuth(true);

      // Set user data
      if (response.data) {
        setUser(response.data);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Function untuk logout
  const logout = () => {
    logoutService();
    setIsAuth(false);
    setUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated: isAuth,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
