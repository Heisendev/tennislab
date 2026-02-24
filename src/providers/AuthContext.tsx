import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { authApi } from "../services/auth.api";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    authApi.getMe().then((me) => {
      setUser(me);
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const me = await authApi.login(username, password);
    setUser(me);
  }, []);

  const signup = useCallback(async (username: string, password: string) => {
    const me = await authApi.signup(username, password);
    setUser(me);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    navigate("/login");
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
