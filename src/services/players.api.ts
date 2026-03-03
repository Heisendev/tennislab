import { API_URL, ensureOk } from "./api.common";

import type { NewPlayer, Player } from "../types";

export interface PlayersApi {
  getPlayers: () => Promise<Player[]>;
  getPlayerById: (id: string) => Promise<Player>;
  createPlayer: (player: NewPlayer) => Promise<Player>;
}

export const playersApi: PlayersApi = {
  getPlayers: async (): Promise<Player[]> => {
    const response = await fetch(`${API_URL}/players`, { credentials: "include" });
    await ensureOk(response, `Failed to fetch players: ${response.statusText}`);
    const data = await response.json();
    return data;
  },
  getPlayerById: async (id: string): Promise<Player> => {
    const response = await fetch(`${API_URL}/players/${id}`, { credentials: "include" });
    await ensureOk(response, `Failed to fetch player: ${response.statusText}`);
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
    await ensureOk(response, `Failed to create player: ${response.statusText}`);
    const data = await response.json();
    return data;
  },
};
