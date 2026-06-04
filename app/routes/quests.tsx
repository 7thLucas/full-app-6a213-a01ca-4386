import { useState, useEffect } from "react";
import { useConfigurables } from "~/modules/configurables";
import { loadPlayer, savePlayer, claimQuestReward, type PlayerProfile } from "~/game/player-store";
import { BottomNav, TopBar } from "~/components/ui/BottomNav";
import { cn } from "~/lib/utils";

function QuestCard({ quest, onClaim }: {
  quest: {
    id: string;
    title: string;
    description: string;
    emoji: string;
    target: number;
    current: number;
    coinReward: number;
    xpReward: number;
    completed: boolean;
    claimed: boolean;
    expiresAt: string;
  };
  onClaim: (id: string) => void;
}) {
  const pct = Math.min((quest.current / quest.target) * 100, 100);

  return (
    <div
      className={cn(
        "game-card p-4 transition-all",
        quest.claimed && "opacity-70"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{
            background: quest.completed
              ? "linear-gradient(135deg, #F5C518, #FF8C00)"
              : "linear-gradient(135deg, #E8D5A3, #F0E6C8)",
          }}
        >
          {quest.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-fredoka text-[#3D2B1F] text-base">{quest.title}</h3>
              <p className="text-[#8B6A3E] text-xs font-nunito">{quest.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className="flex items-center gap-1">
                <span className="text-sm">🪙</span>
                <span className="font-bebas text-[#3D2B1F] text-sm">{quest.coinReward}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm">⭐</span>
                <span className="font-bebas text-[#8B6A3E] text-xs">{quest.xpReward}XP</span>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-[#8B6A3E] font-nunito mb-1">
              <span>{quest.current} / {quest.target}</span>
              <span>{Math.round(pct)}%</span>
            </div>
            <div className="h-2.5 bg-[#E8D5A3] rounded-full overflow-hidden">
              <div
                className="progress-honey h-full"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {quest.completed && !quest.claimed && (
            <button
              onClick={() => onClaim(quest.id)}
              className="mt-3 w-full py-2 rounded-xl font-fredoka text-sm bg-gradient-to-r from-[#F5C518] to-[#FF8C00] text-[#3D2B1F] border-b-2 border-[#C87000] active:border-b-0 active:mt-[13px] transition-all"
            >
              Claim Reward! 🎁
            </button>
          )}
          {quest.claimed && (
            <div className="mt-2 flex items-center gap-1 text-[#4CAF50] text-xs font-nunito font-semibold">
              <span>✓</span>
              <span>Claimed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuestsPage() {
  const { config } = useConfigurables();
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [claimedFeedback, setClaimedFeedback] = useState<string | null>(null);

  useEffect(() => {
    setPlayer(loadPlayer());
  }, []);

  const handleClaim = (questId: string) => {
    if (!player) return;
    const updated = claimQuestReward(player, questId);
    setPlayer(updated);
    setClaimedFeedback("Rewards collected! 🎉");
    setTimeout(() => setClaimedFeedback(null), 2000);
  };

  if (!player) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
        <div className="text-4xl animate-bee-float">🐝</div>
      </div>
    );
  }

  const pendingClaims = player.dailyQuests.filter((q) => q.completed && !q.claimed).length;
  const tomorrow = new Date();
  tomorrow.setHours(24, 0, 0, 0);
  const msUntilReset = tomorrow.getTime() - Date.now();
  const hoursLeft = Math.floor(msUntilReset / 3600000);
  const minsLeft = Math.floor((msUntilReset % 3600000) / 60000);

  return (
    <div className="min-h-screen bg-[#FFF8E7] pb-24">
      <TopBar title="Quest Center 📋" coins={player.coins} />

      {/* Feedback Toast */}
      {claimedFeedback && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-pop-in">
          <div className="bg-[#4CAF50] text-white px-6 py-3 rounded-2xl shadow-xl font-fredoka text-lg">
            {claimedFeedback}
          </div>
        </div>
      )}

      <div className="px-4 py-4">
        {/* Daily Reset Timer */}
        <div className="game-card p-3 flex items-center gap-3 mb-4 bg-gradient-to-r from-[#3D2B1F] to-[#5C3D2E]">
          <div className="text-2xl">⏰</div>
          <div>
            <div className="font-fredoka text-white text-base">Daily Quests Reset In</div>
            <div className="font-bebas text-[#F5C518] text-xl">{hoursLeft}h {minsLeft}m</div>
          </div>
          {pendingClaims > 0 && (
            <div className="ml-auto">
              <div className="w-6 h-6 rounded-full bg-[#FF5252] flex items-center justify-center">
                <span className="text-white text-xs font-bebas font-bold">{pendingClaims}</span>
              </div>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Completed", value: player.dailyQuests.filter((q) => q.completed).length, total: player.dailyQuests.length, emoji: "✅" },
            { label: "Claimed", value: player.dailyQuests.filter((q) => q.claimed).length, total: player.dailyQuests.length, emoji: "🎁" },
            { label: "Streak", value: player.loginStreak, total: null, emoji: "🔥" },
          ].map((s) => (
            <div key={s.label} className="game-card p-3 text-center">
              <div className="text-xl">{s.emoji}</div>
              <div className="font-bebas text-[#3D2B1F] text-xl">
                {s.value}{s.total !== null ? `/${s.total}` : ""}
              </div>
              <div className="text-[#8B6A3E] text-xs font-nunito">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Daily Quests */}
        <h2 className="font-fredoka text-[#3D2B1F] text-xl mb-3">Daily Quests</h2>
        <div className="space-y-3">
          {player.dailyQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} onClaim={handleClaim} />
          ))}
        </div>

        {/* Weekly Challenge Preview */}
        <h2 className="font-fredoka text-[#3D2B1F] text-xl mt-6 mb-3">Weekly Challenge</h2>
        <div className="game-card p-4" style={{ background: "linear-gradient(135deg, #3D2B1F, #5C3D2E)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-4xl">🏆</div>
            <div>
              <h3 className="font-fredoka text-white text-lg">Word Marathon</h3>
              <p className="text-[#C8A96E] text-xs font-nunito">Submit 50 valid words this week</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-[#C8A96E] font-nunito mb-1">
            <span>{Math.min(player.stats.totalWordsSubmitted, 50)} / 50 words</span>
            <span>Reward: 🪙 500 + ⭐ 200XP</span>
          </div>
          <div className="h-3 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min((player.stats.totalWordsSubmitted / 50) * 100, 100)}%`,
                background: "linear-gradient(90deg, #F5C518, #FF8C00)"
              }}
            />
          </div>
        </div>

        {/* Achievement Quick View */}
        <h2 className="font-fredoka text-[#3D2B1F] text-xl mt-6 mb-3">Recent Achievements</h2>
        {player.achievements.length === 0 ? (
          <div className="game-card p-6 text-center">
            <div className="text-4xl mb-2">🌱</div>
            <p className="text-[#8B6A3E] font-nunito text-sm">Play games to earn your first achievement!</p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {player.achievements.slice(-6).reverse().map((achId) => (
              <div key={achId} className="flex-shrink-0 game-card p-3 text-center w-20">
                <div className="text-3xl mb-1">🏅</div>
                <div className="text-[#8B6A3E] text-xs font-nunito truncate">{achId}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
