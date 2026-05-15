import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  useCreateLiveMatch,
  useUpdateLiveMatchStatus,
} from "@hooks/useLiveMatch";
import type { LiveMatch, Match } from "src/types";

import Header from "./Header";
import { Button } from "./ui/Button";
import { StatusBadge } from "./ui/StatusBadge";

const formatDate = (date: string) =>
  new Date(date).toLocaleString("fr-FR", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

const MatchHeader = ({
  match,
  liveMatch,
  readOnly = false,
}: {
  match: Match;
  liveMatch?: LiveMatch | undefined;
  readOnly?: boolean;
}) => {
  const { tournament, round, surface, date, duration } = match;
  const [tossWinner, setTossWinner] = useState<"A" | "B" | undefined>(undefined);
  const [liveClock, setLiveClock] = useState<string>("00:00");
  const createLiveMatch = useCreateLiveMatch();
  const updateMatchStatus = useUpdateLiveMatchStatus();

  const { t } = useTranslation();

  const handleStartLiveMatch = () => {
    createLiveMatch.mutate(match.id);
  };

  useEffect(() => {
    if (!liveMatch || liveMatch.status !== "in-progress") return;
    
    let startTime = new Date(liveMatch.matchStartTime).getTime();

    if(liveMatch.suspendedAt && liveMatch.resumedAt) {
      const suspendedAt = new Date(liveMatch.suspendedAt).getTime();
      const resumedAt = new Date(liveMatch.resumedAt).getTime();
      const suspensionDuration = resumedAt - suspendedAt;
      startTime += suspensionDuration;
    }
    const getElapsed = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const h = Math.floor(elapsed / 3600);
      const m = Math.floor((elapsed % 3600) / 60);
      const s = elapsed % 60;
      const mm = String(m).padStart(2, "0");
      const ss = String(s).padStart(2, "0");
      return h > 0 ? `${String(h).padStart(2, "0")}:${mm}:${ss}` : `${mm}:${ss}`;
    };

    const interval = setInterval(() => setLiveClock(getElapsed()), 1000);
    return () => clearInterval(interval);
  }, [liveMatch]);

  return (
    <>
      <Header title={t("matchStats")} />
      <div className="text-center mb-8">
        {!readOnly && liveMatch && liveMatch.status && (
          <div className="flex flex-col items-center gap-2 my-4 mx-auto justify-center">
            {liveMatch && liveMatch.status !== "created" && (
              <div className="flex items-center gap-2">
                <StatusBadge status={liveMatch.status as Parameters<typeof StatusBadge>[0]['status']} />
              </div>
            )}
            <div className="flex gap-2">
              {liveMatch.status === "created" && (
                <div className="mt-4">
                  <Button onClick={handleStartLiveMatch} variant="secondary">
                    {t("liveMatch.scheduleMatch")}
                  </Button>
                </div>
              )}
              {liveMatch.status === "scheduled" && (
                <div className="flex flex-col">
                    <h4>{t("liveMatch.selectTossWinner")}</h4>
                  <div role="radiogroup" className="toggle mb-2">
                    <input type="radio" name="tossWinner" id="tossWinnerA" value="A" onChange={() => setTossWinner("A")} />
                    <label htmlFor="tossWinnerA">{match.playerA.firstname} {match.playerA.lastname}</label>
                    <input type="radio" name="tossWinner" id="tossWinnerB" value="B" onChange={() => setTossWinner("B")} />
                    <label htmlFor="tossWinnerB">{match.playerB.firstname} {match.playerB.lastname}</label>
                  </div>

                  <Button
                  onClick={() =>
                    updateMatchStatus.mutate({
                      liveMatchId: liveMatch.id,
                      status: "in-progress",
                      tossWinner: tossWinner,
                    })
                  }
                  disabled={!tossWinner}
                  variant="secondary"
                >
                  {t("liveMatch.startLiveMatch")}
                </Button>
                </div>
              )}
              {liveMatch.status === "in-progress" && (
                <>
                  <Button
                    onClick={() =>
                      updateMatchStatus.mutate({
                        liveMatchId: liveMatch.id,
                        status: "suspended",
                      })
                    }
                    variant="primary"
                  >
                    {t("liveMatch.pause")}
                  </Button>
                  <Button
                    onClick={() =>
                      updateMatchStatus.mutate({
                        liveMatchId: liveMatch.id,
                        status: "completed",
                      })
                    }
                    variant="primary"
                  >
                    {t("liveMatch.complete")}
                  </Button>
                </>
              )}
              {liveMatch.status === "suspended" && (
                <>
                  <Button
                    onClick={() =>
                      updateMatchStatus.mutate({
                        liveMatchId: liveMatch.id,
                        status: "resumed",
                        tossWinner: liveMatch.tossWinner,
                      })
                    }
                    variant="secondary"
                  >
                    {t("liveMatch.resume")}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
        <h1 className="text-4xl md:text-6xl font-display text-foreground my-3">
          {tournament}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>{round}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span className="capitalize">{surface}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span>{formatDate(date)}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span>{duration || liveClock}</span>
        </div>
      </div>
    </>
  );
};

export default MatchHeader;
