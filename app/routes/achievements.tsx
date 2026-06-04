import { useState, useEffect } from "react";
import { useConfigurables } from "~/modules/configurables";
import { loadPlayer, type PlayerProfile } from "~/game/player-store";
import { ACHIEVEMENTS, type AchievementDefinition } from "~/game/constants";
import { BottomNav, TopBar } from "~/components/ui/BottomNav";
import { cn } from "~/lib/utils";

type CategoryFilter = "all" | "words" | "score" | "streak" | "quest" | "special";

function AchievementCard({ ach, earned }: { ach: AchievementDefinition; earned: boolean }) {
  return (
    <div
      className={cn(
        "game-card p-4 transition-all",
        earned ? "border-2 border-[#F5C518]/50" : "opacity-60"
      )}
      style={earned ? { background: "linear-gradient(135deg, #FFF8E7, #FFF0C8)" } : {}}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-inner",
            earned
              ? "bg-gradient-to-br from-[#F5C518] to-[#FF8C00]"
              : "bg-[#E8D5A3]"
          )}
        >
          {earned ? ach.emoji : "🔒"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-fredoka text-[#3D2B1F] text-base">{ach.name}</h3>
            {earned && <span className="text-[#4CAF50] text-sm">✓</span>}
          </div>
          <p className="text-[#8B6A3E] text-xs font-nunito">{ach.description}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-[#FF8C00] font-nunito font-semibold">🪙 {ach.coinReward}</span>
            <span className="text-xs text-[#64B5F6] font-nunito font-semibold">⭐ {ach.xpReward} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  const { config } = useConfigurables();
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [filter, setFilter] = useState<CategoryFilter>("all");

  useEffect(() => {
    setPlayer(loadPlayer());
  }, []);

  if (!player) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
        <div className="text-4xl animate-bee-float">🐝</div>
      </div>
    );
  }

  const categories: { key: CategoryFilter; label: string; emoji: string }[] = [
    { key: "all", label: "All", emoji: "🏅" },
    { key: "words", label: "Words", emoji: "📝" },
    { key: "score", label: "Score", emoji: "🎯" },
    { key: "streak", label: "Streak", emoji: "🔥" },
    { key: "quest", label: "Quest", emoji: "📋" },
    { key: "special", label: "Special", emoji: "⭐" },
  ];

  const filtered = ACHIEVEMENTS.filter((a) => filter === "all" || a.category === filter);
  const earnedCount = filtered.filter((a) => player.achievements.includes(a.id)).length;

  // Sort: earned first
  const sorted = [...filtered].sort((a, b) => {
    const ae = player.achievements.includes(a.id);
    const be = player.achievements.includes(b.id);
    if (ae && !be) return -1;
    if (!ae && be) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#FFF8E7] pb-24">
      <TopBar title="Achievements 🏅" coins={player.coins} />

      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-[#3D2B1F] to-[#5C3D2E] px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[#C8A96E] text-xs font-nunito">Total Earned</p>
            <div className="font-bebas text-[#F5C518] text-3xl">{player.achievements.length}/{ACHIEVEMENTS.length}</div>
          </div>
          <div className="text-center">
            <div className="text-5xl animate-bee-float">🏆</div>
          </div>
          <div className="text-right">
            <p className="text-[#C8A96E] text-xs font-nunito">Completion</p>
            <div className="font-bebas text-white text-3xl">
              {Math.round((player.achievements.length / ACHIEVEMENTS.length) * 100)}%
            </div>
          </div>
        </div>
        {/* Overall Progress Bar */}
        <div className="h-3 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${(player.achievements.length / ACHIEVEMENTS.length) * 100}%`,
              background: "linear-gradient(90deg, #F5C518, #FF8C00)"
            }}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={cn(
              "flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full font-nunito font-semibold text-sm transition-all",
              filter === cat.key
                ? "bg-gradient-to-r from-[#F5C518] to-[#FF8C00] text-[#3D2B1F] shadow-md"
                : "bg-white text-[#8B6A3E] border border-[#E8C87A]/60"
            )}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="px-4 mb-3">
        <p className="text-[#8B6A3E] text-sm font-nunito">
          {earnedCount} / {filtered.length} earned in this category
        </p>
      </div>

      {/* Achievements Grid */}
      <div className="px-4 space-y-3">
        {sorted.map((ach) => (
          <AchievementCard
            key={ach.id}
            ach={ach}
            earned={player.achievements.includes(ach.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {sorted.length === 0 && (
        <div className="px-4 py-12 text-center">
          <div className="text-6xl mb-4">🌱</div>
          <p className="font-fredoka text-[#8B6A3E] text-xl">No achievements here yet!</p>
          <p className="text-[#8B6A3E] text-sm font-nunito mt-1">Keep playing to unlock them.</p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
