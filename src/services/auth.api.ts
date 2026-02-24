import type { User } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3003";

export const authApi = {
  login: async (username: string, password: string): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Login failed");
    return data;
  },

  signup: async (username: string, password: string): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Signup failed");
    return data;
  },

  logout: async (): Promise<void> => {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  },

  getMe: async (): Promise<User | null> => {
    const response = await fetch(`${API_URL}/auth/me`, {
      credentials: "include",
    });
    if (response.status === 401) return null;
    if (!response.ok) return null;
    return response.json();
  },
};
