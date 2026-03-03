import { API_URL, buildApiError } from "./api.common";

import type { User } from "../types";

export const authApi = {
  login: async (username: string, password: string): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw await buildApiError(response, "Login failed");
    }
    const data = await response.json();
    return data;
  },

  signup: async (username: string, password: string): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw await buildApiError(response, "Signup failed");
    }
    const data = await response.json();
    return data;
  },

  logout: async (): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw await buildApiError(response, "Logout failed");
    }
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
