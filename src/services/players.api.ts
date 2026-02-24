import type { NewPlayer, Player } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3003";

export interface PlayersApi {
  getPlayers: () => Promise<Player[]>;
  getPlayerById: (id: string) => Promise<Player>;
  createPlayer: (player: NewPlayer) => Promise<Player>;
}

export const playersApi: PlayersApi = {
  getPlayers: async (): Promise<Player[]> => {
    const response = await fetch(`${API_URL}/players`, { credentials: "include" });
    const data = await response.json();
    return data;
  },
  getPlayerById: async (id: string): Promise<Player> => {
    const response = await fetch(`${API_URL}/players/${id}`, { credentials: "include" });
    if (!response.ok) {
            throw new Error(`Failed to fetch player: ${response.statusText}`);
        }
    const data = await response.json();
    return data;
  },
  createPlayer: async (newPlayer: NewPlayer): Promise<Player> => {
    const response = await fetch(`${API_URL}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(newPlayer),
    });
    if (!response.ok) {
            throw new Error(`Failed to create player: ${response.statusText}`);
        }
    const data = await response.json();
    return data;
  },
};
