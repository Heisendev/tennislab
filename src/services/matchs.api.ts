import type { Match, NewMatch } from "../types";

export interface MatchsApi {
  getMatchs: () => Promise<Match[]>;
  getmatchById: (id: string) => Promise<Match>;
  createMatch: (match: NewMatch) => Promise<Match>;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3003";

export const matchsApi: MatchsApi = {
  getMatchs: async () => {
    // Simulate an API call with a delay
    const response = await fetch(`${API_URL}/matchs`);
    if (!response.ok) {
            throw new Error(`Failed to fetch matchs: ${response.statusText}`);
        }
    const data = await response.json();
    return data;
  },
  getmatchById: async (id: string) => {
    const response = await fetch(`${API_URL}/matchs/${id}`);
    if (!response.ok) {
            throw new Error(`Failed to fetch match by id: ${response.statusText}`);
        }
    const data = await response.json();
    return data;
  },
  createMatch: async (match: NewMatch) => {
    const response = await fetch(`${API_URL}/matchs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(match),
    });
    if (!response.ok) {
            throw new Error(`Failed to create match: ${response.statusText}`);
        }
    const data = await response.json();
    return data;
  },
};
