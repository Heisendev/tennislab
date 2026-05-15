import { motion } from "framer-motion";
import { Earth, EarthLock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";

import Header from "@components/Header";
import { useGetLiveMatches, useGetMatches } from "@hooks/useMatches";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

const Matches = () => {
  const { data: allmatches, isLoading } = useGetMatches();
  const { data: liveMatches } = useGetLiveMatches();
  const { t } = useTranslation();
  const location = useLocation();

  console.log("location", location);

  const matchesType = location.pathname === "/matches/live" ? "live" : "all";

  const matches =  matchesType === "live" ? liveMatches?.filter(match => match.status === "in-progress") : allmatches;

  return (
    <>
      <Header title={t("matches.title")} />
      <main className="md:m-8">
        <div className="mx-auto max-w-3xl px-0 py-0">
          <h2 className="mt-4 text-xl font-semibold">
            {matchesType === "live" ? t("liveMatch.in-progress") : t("matches.recentMatches")}
          </h2>
          {isLoading && <p>Loading...</p>}
          <motion.ul
            className="flex list-none flex-col pl-0"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {matches &&
              matches.length > 0 &&
              matches.map((match) => (
                <motion.li
                  animate="show"
                  key={match.id}
                  variants={item}
                  className="flex py-2"
                >
                  <Link
                    key={match.id}
                    to={`/matches/${match.id}`}
                    className="group hover:bg-primary-dark hover:no-underline w-full px-6 text-(--color-text-static-primary) transition-colors"
                  >
                    <div className="rounded-md shadow-(--shadow-md) group-hover:glow-primary relative flex justify-between border border-gray-400 bg-white p-4 align-middle transition-all duration-300 hover:border-gray-600 md:px-2 md:py-4">
                      <span className="flex items-center group-hover:underline">
                        {match.playerA.firstname} {match.playerA.lastname} vs{" "}
                        {match.playerB.firstname} {match.playerB.lastname} -{" "}
                        {match.tournament} {match.round}{" "}
                      </span>
                      {!match.isPublic ? (
                        <span className="flex items-center rounded bg-(--color-background-interactive-tertiary-default) px-2 py-1 text-xs text-white">
                          <EarthLock
                            size="1rem"
                            className="mr-1 inline-block"
                          />
                          {t("matches.private")}
                        </span>
                      ) : (
                        <span className="flex items-center rounded bg-(--color-background-interactive-success-default) px-2 py-1 text-xs text-white">
                          <Earth
                            size="1rem"
                            className="mr-1 inline-block"
                          />
                          {t("matches.public")}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.li>
              ))}
          </motion.ul>
        </div>
      </main>
    </>
  );
};

export default Matches;
