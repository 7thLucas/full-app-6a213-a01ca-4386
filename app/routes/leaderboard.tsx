import { useState, useEffect } from "react";
import { useConfigurables } from "~/modules/configurables";
import { loadPlayer, getMockLeaderboard, type PlayerProfile, type LeaderboardEntry } from "~/game/player-store";
import { BottomNav, TopBar } from "~/components/ui/BottomNav";
import { cn } from "~/lib/utils";

type LeaderboardTab = "daily" | "weekly" | "alltime";

function LeaderboardRow({ entry, isCurrentPlayer }: { entry: LeaderboardEntry; isCurrentPlayer: boolean }) {
  const rankColors: Record<number, string> = {
    1: "from-[#FFD700] to-[#FFA000]",
    2: "from-[#C0C0C0] to-[#9E9E9E]",
    3: "from-[#CD7F32] to-[#A0522D]",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-2xl transition-all",
        isCurrentPlayer
          ? "bg-gradient-to-r from-[#F5C518]/20 to-[#FF8C00]/20 border-2 border-[#F5C518]/40"
          : "bg-white border border-[#E8C87A]/30"
      )}
    >
      {/* Rank */}
      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
        {entry.rank <= 3 ? (
          <div
            className={cn(
              "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bebas text-xl shadow-md",
              rankColors[entry.rank]
            )}
          >
            {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : entry.rank}
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#E8D5A3] flex items-center justify-center font-bebas text-[#8B6A3E] text-xl">
            {entry.rank}
          </div>
        )}
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-base">{entry.badge}</span>
          <span className={cn("font-fredoka text-base", isCurrentPlayer ? "text-[#3D2B1F]" : "text-[#3D2B1F]")}>
            {entry.username}
            {isCurrentPlayer && <span className="text-xs text-[#FF8C00] ml-1 font-nunito">(you)</span>}
          </span>
        </div>
        <div className="text-[#8B6A3E] text-xs font-nunito">Level {entry.level}</div>
      </div>

      {/* Score */}
      <div className="text-right flex-shrink-0">
        <div className="font-bebas text-[#3D2B1F] text-xl">{entry.score.toLocaleString()}</div>
        <div className="text-[#8B6A3E] text-xs font-nunito">pts</div>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const { config } = useConfigurables();
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [tab, setTab] = useState<LeaderboardTab>("weekly");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const p = loadPlayer();
    setPlayer(p);
    const board = getMockLeaderboard();

    // Insert current player if not already in list
    const playerEntry: LeaderboardEntry = {
      rank: 0,
      username: p.username,
      score: p.stats.bestScore,
      level: p.level,
      badge: "🐝",
    };

    const combined = [...board, playerEntry]
      .sort((a, b) => b.score - a.score)
      .map((e, i) => ({ ...e, rank: i + 1 }));

    setEntries(combined);
  }, []);

  if (!player) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
        <div className="text-4xl animate-bee-float">🐝</div>
      </div>
    );
  }

  const playerRank = entries.find((e) => e.username === player.username)?.rank ?? null;

  const tabs: { key: LeaderboardTab; label: string }[] = [
    { key: "daily", label: "Today" },
    { key: "weekly", label: "This Week" },
    { key: "alltime", label: "All Time" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E7] pb-24">
      <TopBar title="Leaderboard 🏆" coins={player.coins} />

      {/* Your Rank Banner */}
      <div className="bg-gradient-to-r from-[#3D2B1F] to-[#5C3D2E] px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#C8A96E] text-xs font-nunito">Your Rank</p>
            <div className="font-bebas text-[#F5C518] text-3xl">
              {playerRank ? `#${playerRank}` : "Unranked"}
            </div>
          </div>
          <div className="text-center">
            <p className="text-[#C8A96E] text-xs font-nunito">Best Score</p>
            <div className="font-bebas text-white text-3xl">{player.stats.bestScore.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <p className="text-[#C8A96E] text-xs font-nunito">Level</p>
            <div className="font-bebas text-[#F5C518] text-3xl">{player.level}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-3 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 py-2 rounded-full font-nunito font-semibold text-sm transition-all",
              tab === t.key
                ? "bg-gradient-to-r from-[#F5C518] to-[#FF8C00] text-[#3D2B1F] shadow-md"
                : "bg-white text-[#8B6A3E] border border-[#E8C87A]/60"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      {entries.length >= 3 && (
        <div className="px-4 mb-4">
          <div className="flex items-end justify-center gap-3">
            {/* 2nd Place */}
            <div className="flex flex-col items-center flex-1">
              <div className="text-3xl mb-1">🥈</div>
              <div className="bg-[#C0C0C0] rounded-t-2xl w-full py-4 flex flex-col items-center">
                <div className="font-fredoka text-white text-base">{entries[1]?.username}</div>
                <div className="font-bebas text-[#3D2B1F] text-lg">{entries[1]?.score.toLocaleString()}</div>
              </div>
              <div className="bg-[#9E9E9E] rounded-b-xl w-full py-1 text-center">
                <span className="font-bebas text-white text-sm">#2</span>
              </div>
            </div>

            {/* 1st Place - taller */}
            <div className="flex flex-col items-center flex-1 -mb-2">
              <div className="text-4xl mb-1">👑</div>
              <div className="bg-gradient-to-br from-[#F5C518] to-[#FF8C00] rounded-t-2xl w-full py-6 flex flex-col items-center shadow-lg">
                <div className="font-fredoka text-white text-base">{entries[0]?.username}</div>
                <div className="font-bebas text-[#3D2B1F] text-xl">{entries[0]?.score.toLocaleString()}</div>
              </div>
              <div className="bg-[#C87000] rounded-b-xl w-full py-1 text-center">
                <span className="font-bebas text-white text-sm">#1</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center flex-1">
              <div className="text-3xl mb-1">🥉</div>
              <div className="bg-[#CD7F32] rounded-t-2xl w-full py-3 flex flex-col items-center">
                <div className="font-fredoka text-white text-base">{entries[2]?.username}</div>
                <div className="font-bebas text-[#3D2B1F] text-lg">{entries[2]?.score.toLocaleString()}</div>
              </div>
              <div className="bg-[#A0522D] rounded-b-xl w-full py-1 text-center">
                <span className="font-bebas text-white text-sm">#3</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Rankings */}
      <div className="px-4 space-y-2">
        <h2 className="font-fredoka text-[#3D2B1F] text-xl mb-3">Full Rankings</h2>
        {entries.map((entry) => (
          <LeaderboardRow
            key={`${entry.rank}-${entry.username}`}
            entry={entry}
            isCurrentPlayer={entry.username === player.username}
          />
        ))}
      </div>

      {/* "Climb up" CTA */}
      <div className="px-4 mt-4 mb-2">
        <div className="game-card p-4 text-center bg-gradient-to-br from-[#FFF8E7] to-[#FFF0C8]">
          <div className="text-3xl mb-2">🐝</div>
          <p className="text-[#5C3D2E] font-fredoka text-base">Play more games to climb the rankings!</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
