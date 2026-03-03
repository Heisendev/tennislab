import { API_URL, ensureOk } from "./api.common";

import type { Match, NewMatch } from "../types";

export interface MatchesApi {
  getMatches: () => Promise<Match[]>;
  getMatchById: (id: string) => Promise<Match>;
  createMatch: (match: NewMatch) => Promise<Match>;
}

export const matchesApi: MatchesApi = {
  getMatches: async () => {
    const response = await fetch(`${API_URL}/matches`, { credentials: "include" });
    await ensureOk(response, `Failed to fetch matches: ${response.statusText}`);
    const data = await response.json();
    return data;
  },
  getMatchById: async (id: string) => {
    const response = await fetch(`${API_URL}/matches/${id}`, { credentials: "include" });
    await ensureOk(response, `Failed to fetch match by id: ${response.statusText}`);
    const data = await response.json();
    return data;
  },
  createMatch: async (match: NewMatch) => {
    const response = await fetch(`${API_URL}/matches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(match),
    });
    await ensureOk(response, `Failed to create match: ${response.statusText}`);
    const data = await response.json();
    return data;
  },
};
