import { createContext } from "react";
import type { LoginRequest, UserData } from "../services/authService";

// Interface untuk Auth Context
export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Membuat context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
