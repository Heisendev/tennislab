import type { LiveMatch } from "src/types";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3003";

export interface LiveMatchApi {
    createLiveMatch: (matchid: number) => Promise<LiveMatch>;
    updateLiveMatchStatus: (liveMatchId: number, status: "scheduled" | "in-progress" | "completed" | "suspended", tossWinner?: "A" | "B") => Promise<string>;
    getLiveMatchById: (id: string) => Promise<LiveMatch>;
    addPoint: (matchId:number, liveMatchId: number, player?: 'A' | 'B', serveResult?: string, serveType?: string, winnerShot?: string) => Promise<LiveMatch>;
}

export const liveMatchApi: LiveMatchApi = {
    createLiveMatch: async (matchid: number) => {
        const response = await fetch(`${API_URL}/live-scoring/sessions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ match_id: matchid }),
        });
        if (!response.ok) {
            throw new Error(`Failed to create live match: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    },
    updateLiveMatchStatus: async (liveMatchId: number, status: "scheduled" | "in-progress" | "completed" | "suspended", tossWinner?: "A" | "B") => {
        const response = await fetch(`${API_URL}/live-scoring/sessions/${liveMatchId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status, toss_winner: tossWinner}),
        });
        if (!response.ok) {
            throw new Error(`Failed to update live match status: ${response.statusText}`);
        }
        const data = await response.json();
        return data.message;
    },
    getLiveMatchById: async (id: string) => {
        const response = await fetch(`${API_URL}/live-scoring/sessions/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to get live match: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    },
    addPoint: async (matchId:number, liveMatchId: number, player?: 'A' | 'B', serveResult?: string, serveType?: string, winnerShot?: string) => {
        const response = await fetch(`${API_URL}/live-scoring/sessions/${liveMatchId}/point`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ match_id: matchId, winner: player, serve_result: serveResult, serve_type: serveType, winner_shot: winnerShot }),
        });
        if (!response.ok) {
            throw new Error(`Failed to add point: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    },
};