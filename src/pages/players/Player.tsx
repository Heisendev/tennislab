import { motion } from "framer-motion";
import {
  TrendingUp,
  Award,
  Calendar,
  Ruler,
  Weight,
  Hand,
  Zap,
  Target,
  Trophy,
  Earth,
} from "lucide-react";
import { Link, useParams } from "react-router";

import Header from "@components/Header";
import { Card } from "@components/ui/Card";
import { COUNTRIES } from "@components/ui/Countryselector/countries";
import { useGetMatches } from "@hooks/useMatches";
import { usePlayerById } from "@hooks/usePlayers";
import type { Match } from "src/types";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const getCountryFullName = (locale:string): string => {
    return COUNTRIES.find((item) => item.value === locale)?.title || locale;
}

const getPlayerAge = (birthday: string | null | undefined): string => {
    if (!birthday) return "N/A";
    const age = Math.floor((Date.now() - new Date(birthday).getTime()) / 31557600000);
    return `${age} years`;
}

const PlayerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: player } = usePlayerById(id || "");
  const { data: matches } = useGetMatches();

  if (!player) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Player not found</p>
          <Link to="/players" className="text-primary text-sm hover:underline">
            ← Back to Players
          </Link>
        </div>
      </div>
    );
  }

  const age = getPlayerAge(player.birthday);

  const winRate = 90;

  // Find matches involving this player
  const playerMatches = matches
    ? matches.filter(
        (m: Match) =>
          m.playerA.lastname.includes(player.lastname) ||
          m.playerB.lastname.includes(player.lastname),
      )
    : [];

  const statCards = [
    { label: "Ranking", value: player.rank, icon: TrendingUp },
    { label: "Win Rate", value: `${winRate}%`, icon: Target },
    { label: "Titles", value: 18, icon: Trophy },
    { label: "Grand Slams", value: 12, icon: Award },
    { label: "Career W-L", value: `90-10`, icon: Zap },
    { label: "Turned Pro", value: "2016", icon: Calendar },
  ];

  const bioDetails = [
    { label: "Age", value: `${age}`, icon: Calendar },
    { label: "Height", value: `${player.height_cm} cm`, icon: Ruler },
    { label: "Weight", value: `${player.weight_kg} kg`, icon: Weight },
    { label: "Plays", value: `${player.hand}`, icon: Hand },
    { label: "Backhand", value: player.backhand, icon: Hand },
    { label: "Country", value:  getCountryFullName(player.country), icon: Earth },
  ];

  return (
    <div className="bg-background court-texture min-h-screen">
      <Header title={`${player.lastname} ${player.firstname}`} />

      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        {/* Hero section */}
        <motion.div
          className="flex flex-col items-start gap-8 md:flex-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Player image */}
          <motion.div
            className="w-full shrink-0 md:w-72"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-card/60 relative overflow-hidden border border-gray-400 p-0!">
              <img
                src={player.picture || `/players/defaultplayer.jpeg`}
                alt={`${player.lastname} ${player.firstname}`}
                className="h-80 w-full bg-white object-cover md:h-96"
              />
              <div className="absolute inset-x-0 bottom-0 p-2">
                <Card className="flex items-center gap-2 backdrop-blur-md">
                  <img
                    alt={player.country}
                    src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${player.country}.svg`}
                    className={"h-8"}
                  />
                  <div>
                    <p className="font-display text-foreground text-2xl tracking-wide">
                      {player.firstname} {player.lastname}
                    </p>
                    <p className="text-muted-foreground font-mono text-xs">
                      {getCountryFullName(player.country)} • Age {age}
                    </p>
                  </div>
                </Card>
              </div>
            </Card>
          </motion.div>

          {/* Stats grid */}
          <div className="w-full flex-1">
            <motion.div
              className="grid grid-cols-2 gap-3 sm:grid-cols-3"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              {statCards.map((stat) => (
                <Card
                  key={stat.label}
                  className="flex-col justify-center text-center"
                >
                  <div className="mb-2 flex items-center justify-center gap-2 pr-6">
                    <stat.icon className="text-primary h-4 w-4" />
                    <span className="text-muted-foreground text-[10px] tracking-widest uppercase">
                      {stat.label}
                    </span>
                  </div>
                  <p className="font-display text-foreground text-3xl">
                    {stat.value}
                  </p>
                </Card>
              ))}
            </motion.div>

            {/* Win rate bar */}
            <motion.div
              className=""
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Card className="mt-4 flex-col">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-muted-foreground text-[10px] tracking-widest uppercase">
                    Career Win Rate
                  </span>
                  <span className="font-display text-foreground text-xl">
                    {winRate}%
                  </span>
                </div>
                <div className="bg-border h-2 w-full overflow-hidden rounded-full">
                  <motion.div
                    className="stat-gradient h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${winRate}%` }}
                    transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-1 flex justify-between">
                  <span className="text-muted-foreground font-mono text-[10px]">
                    90 W
                  </span>
                  <span className="text-muted-foreground font-mono text-[10px]">
                    30 L
                  </span>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Bio details */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
        >
          <h2 className="font-display text-foreground mb-4 text-2xl tracking-wider">
            Player Info
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {bioDetails.map((detail) => (
              <Card
                key={detail.label}
                className="flex-col"
              >
                <detail.icon className="text-primary mx-auto mb-1 h-4 w-4" />
                <p className="text-muted-foreground mb-1 text-[10px] tracking-widest uppercase">
                  {detail.label}
                </p>
                <p className="text-foreground text-sm font-medium">
                  {detail.value}
                </p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Match history */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
        >
          <h2 className="font-display text-foreground mb-4 text-2xl tracking-wider">
            Match History
            <span className="text-muted-foreground ml-3 font-mono text-sm">
              {playerMatches.length} recorded
            </span>
          </h2>

          {playerMatches.length === 0 ? (
            <div className="bg-card/60 border border-gray-400 p-8 text-center backdrop-blur-sm">
              <p className="text-muted-foreground text-sm">
                No recorded matches yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {playerMatches.map((match) => {
                const lastName = player.lastname;
                const isPlayerA = match.playerA.lastname.includes(lastName);
                const isWinner =
                  (isPlayerA && match.winner === "A") ||
                  (!isPlayerA && match.winner === "B");

                return (
                  <Link
                    key={match.id}
                    to={`/matches/${match.id}`}
                    className="group block"
                  >
                    <Card className="bg-card/60 hover:border-primary/40 hover:glow-primary border border-gray-400 p-4 backdrop-blur-sm transition-all duration-300">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          {isWinner ? (
                            <span className="text-primary bg-primary/10 shrink-0 rounded px-2 py-0.5 text-xs font-semibold tracking-wider uppercase">
                              W
                            </span>
                          ) : (
                            <span className="text-destructive bg-destructive/10 shrink-0 rounded px-2 py-0.5 text-xs font-semibold tracking-wider uppercase">
                              L
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="font-display text-foreground truncate text-lg tracking-wide">
                              {match.playerA.lastname} {match.playerA.firstname}{" "}
                              vs {match.playerB.lastname}{" "}
                              {match.playerB.firstname}
                            </p>
                            <p className="text-muted-foreground font-mono text-xs">
                              {match.tournament} • {match.round} •{" "}
                              {match.surface}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PlayerDetail;
