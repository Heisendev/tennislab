import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@providers/query-client";

import { liveMatchApi } from "../services/liveMatch.api";
import { matchesApi } from "../services/matches.api";
import type { LiveMatch, Match, NewMatch } from "../types";

const MATCHES_QUERY_KEY = ["matches"];

export function useGetMatches() {
  return useQuery<Match[], Error>({
    queryKey: MATCHES_QUERY_KEY,
    queryFn: matchesApi.getMatches,
  });
}

export function useGetLiveMatches() {
  return useQuery<LiveMatch[], Error>({
    queryKey: [...MATCHES_QUERY_KEY, "live"],
    queryFn: liveMatchApi.getLiveMatches,
  });
}

export function useMatchById(id: string) {
  return useQuery<Match, Error>({
    queryKey: ["match", id],
    queryFn: () => matchesApi.getMatchById(id),
  });
}

export function useCreateMatch() {
  return useMutation({
    mutationFn: (newMatch: NewMatch) => matchesApi.createMatch(newMatch),
    onSuccess: () => {
      // Invalidate and refetch matches after creating a new one
      queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEY });
    },
  });
}