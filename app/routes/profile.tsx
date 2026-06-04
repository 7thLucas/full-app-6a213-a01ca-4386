import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { loadPlayer, savePlayer, type PlayerProfile } from "~/game/player-store";
import { ACHIEVEMENTS } from "~/game/constants";
import { BeeAvatar } from "~/components/ui/BeeAvatar";
import { CoinDisplay } from "~/components/ui/CoinDisplay";
import { XPBar } from "~/components/ui/XPBar";
import { BottomNav, TopBar } from "~/components/ui/BottomNav";
import { cn } from "~/lib/utils";

const AVATAR_COLORS = ["#F5C518", "#FF8C00", "#4CAF50", "#64B5F6", "#9C27B0", "#FF5252"];

export default function ProfilePage() {
  const { config } = useConfigurables();
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const p = loadPlayer();
    setPlayer(p);
    setNewName(p.username);
  }, []);

  const handleSaveName = () => {
    if (!player || !newName.trim()) return;
    const updated = { ...player, username: newName.trim() };
    savePlayer(updated);
    setPlayer(updated);
    setEditingName(false);
  };

  if (!player) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
        <div className="text-4xl animate-bee-float">🐝</div>
      </div>
    );
  }

  const xpPct = Math.min((player.xp / player.xpToNextLevel) * 100, 100);
  const earnedAchs = ACHIEVEMENTS.filter((a) => player.achievements.includes(a.id));
  const unearnedAchs = ACHIEVEMENTS.filter((a) => !player.achievements.includes(a.id));

  return (
    <div className="min-h-screen bg-[#FFF8E7] pb-24">
      <TopBar title="Profile 👤" coins={player.coins} />

      <div className="px-4 py-4 space-y-4">
        {/* Profile Card */}
        <div className="game-card p-5" style={{ background: "linear-gradient(135deg, #3D2B1F, #5C3D2E)" }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <BeeAvatar size={72} />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-[#F5C518] to-[#FF8C00] flex items-center justify-center shadow-md border-2 border-[#3D2B1F]">
                <span className="font-bebas text-[#3D2B1F] text-xs font-bold">{player.level}</span>
              </div>
            </div>
            <div className="flex-1">
              {editingName ? (
                <div className="flex gap-2">
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    maxLength={20}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white text-[#3D2B1F] font-fredoka text-lg border-2 border-[#F5C518] focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  />
                  <button onClick={handleSaveName} className="px-3 py-1.5 rounded-xl bg-[#F5C518] text-[#3D2B1F] font-bold text-sm">✓</button>
                  <button onClick={() => setEditingName(false)} className="px-3 py-1.5 rounded-xl bg-[rgba(255,255,255,0.1)] text-white text-sm">✕</button>
                </div>
              ) : (
                <button onClick={() => setEditingName(true)} className="flex items-center gap-2 group">
                  <span className="font-fredoka text-white text-xl">{player.username}</span>
                  <span className="text-[#C8A96E] text-sm opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
                </button>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[#F5C518] text-sm">🔥</span>
                <span className="text-[#C8A96E] text-xs font-nunito">{player.loginStreak}-day login streak</span>
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-nunito">
              <span className="text-[#F5C518]">Level {player.level}</span>
              <span className="text-[#C8A96E]">{player.xp.toLocaleString()} / {player.xpToNextLevel.toLocaleString()} XP</span>
              <span className="text-[#C8A96E]">Level {player.level + 1}</span>
            </div>
            <div className="h-4 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${xpPct}%`, background: "linear-gradient(90deg, #F5C518, #FF8C00)" }}
              />
            </div>
          </div>

          {/* Coins */}
          <div className="mt-3 flex items-center justify-center gap-2 bg-[rgba(245,197,24,0.15)] rounded-xl py-2">
            <span className="text-2xl">🪙</span>
            <span className="font-bebas text-[#F5C518] text-2xl">{player.coins.toLocaleString()}</span>
            <span className="text-[#C8A96E] text-sm font-nunito">coins</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div>
          <h2 className="font-fredoka text-[#3D2B1F] text-xl mb-3">Player Statistics</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Words", value: player.stats.totalWordsSubmitted.toLocaleString(), emoji: "📝" },
              { label: "Total Score", value: player.stats.totalScore.toLocaleString(), emoji: "🎯" },
              { label: "Best Game Score", value: player.stats.bestScore.toLocaleString(), emoji: "🏆" },
              { label: "Games Played", value: player.stats.gamesPlayed.toLocaleString(), emoji: "🎮" },
              { label: "Longest Word", value: player.stats.longestWord || "—", emoji: "📏" },
              { label: "Best Word Score", value: player.stats.highestWordScore.toLocaleString(), emoji: "⭐" },
              { label: "Login Streak", value: `${player.loginStreak} days`, emoji: "🔥" },
              { label: "Achievements", value: `${player.achievements.length}/${ACHIEVEMENTS.length}`, emoji: "🏅" },
            ].map((stat) => (
              <div key={stat.label} className="game-card p-3">
                <div className="text-xl mb-1">{stat.emoji}</div>
                <div className="font-bebas text-[#3D2B1F] text-xl leading-tight">{stat.value}</div>
                <div className="text-[#8B6A3E] text-xs font-nunito">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Summary */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-fredoka text-[#3D2B1F] text-xl">Inventory</h2>
            <Link to="/inventory" className="text-[#FF8C00] text-sm font-nunito font-semibold">See All →</Link>
          </div>
          <div className="game-card p-4">
            <div className="flex gap-3 flex-wrap">
              {Object.entries(player.inventory.powerups).map(([id, qty]) => {
                const pu = ["reveal", "shuffle", "highlight", "double", "time_ext"].includes(id);
                if (!pu || qty === 0) return null;
                const emoji = { reveal: "🔍", shuffle: "🔀", highlight: "✨", double: "⚡", time_ext: "⏰" }[id] ?? "🎯";
                return (
                  <div key={id} className="flex items-center gap-1 bg-[#FFF8E7] rounded-xl px-3 py-2 border border-[#E8C87A]/40">
                    <span className="text-xl">{emoji}</span>
                    <span className="font-bebas text-[#3D2B1F] text-lg">×{qty}</span>
                  </div>
                );
              })}
              {Object.values(player.inventory.powerups).every((q) => q === 0) && (
                <p className="text-[#8B6A3E] text-sm font-nunito">No power-ups! Visit the shop.</p>
              )}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-fredoka text-[#3D2B1F] text-xl">Achievements</h2>
            <Link to="/achievements" className="text-[#FF8C00] text-sm font-nunito font-semibold">See All →</Link>
          </div>

          {earnedAchs.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {earnedAchs.map((ach) => (
                <div key={ach.id} className="game-card p-3 text-center" style={{ border: "2px solid #F5C518" }}>
                  <div className="text-3xl mb-1">{ach.emoji}</div>
                  <div className="font-fredoka text-[#3D2B1F] text-xs leading-tight">{ach.name}</div>
                </div>
              ))}
            </div>
          )}

          {unearnedAchs.length > 0 && (
            <p className="text-[#8B6A3E] text-xs font-nunito text-center">{unearnedAchs.length} more to unlock!</p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Link
            to="/shop"
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg font-fredoka"
            style={{ background: "linear-gradient(135deg,#F5C518,#FF8C00)", borderBottom: "4px solid #C87000", borderRadius: 28 }}
          >
            🛒 Visit Shop
          </Link>
          <Link
            to="/settings"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-nunito font-semibold text-[#8B6A3E] border-2 border-[#E8C87A]/60"
          >
            ⚙️ Settings
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
