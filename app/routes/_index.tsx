import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { BeeAvatar } from "~/components/ui/BeeAvatar";
import { CoinDisplay } from "~/components/ui/CoinDisplay";
import { XPBar } from "~/components/ui/XPBar";
import { BottomNav, TopBar } from "~/components/ui/BottomNav";
import { loadPlayer, checkDailyLogin, savePlayer, type PlayerProfile } from "~/game/player-store";
import { WORLDS } from "~/game/constants";

function DailyLoginModal({
  coins,
  streak,
  onClose,
}: {
  coins: number;
  streak: number;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="game-card mx-4 w-full max-w-sm p-6 text-center animate-pop-in"
        style={{ border: "3px solid #F5C518" }}
      >
        <div className="text-6xl mb-2">🎁</div>
        <h2 className="font-fredoka text-2xl text-[#3D2B1F] mb-1">Daily Login!</h2>
        <p className="text-[#8B6A3E] text-sm mb-4 font-nunito">
          {streak > 1 ? `${streak}-day streak bonus!` : "Welcome back!"}
        </p>

        <div className="bg-gradient-to-br from-[#F5C518]/20 to-[#FF8C00]/20 rounded-2xl py-6 mb-4 border border-[#F5C518]/30">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl">🪙</span>
            <span className="font-bebas text-4xl text-[#3D2B1F]">+{coins}</span>
          </div>
          <p className="text-[#8B6A3E] text-xs mt-1 font-nunito">coins earned</p>
        </div>

        {streak > 1 && (
          <div className="flex justify-center gap-2 mb-4">
            {Array.from({ length: Math.min(streak, 7) }, (_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ background: i < streak ? "linear-gradient(135deg,#F5C518,#FF8C00)" : "#E8D5A3" }}
              >
                {i < streak ? "🔥" : "○"}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="btn-primary w-full py-3 text-lg font-nunito font-bold"
        >
          Collect Honey!
        </button>
      </div>
    </div>
  );
}

function QuickModeCard({
  emoji,
  title,
  description,
  href,
  color,
  locked,
}: {
  emoji: string;
  title: string;
  description: string;
  href: string;
  color: string;
  locked?: boolean;
}) {
  return (
    <Link
      to={locked ? "#" : href}
      className={`game-card p-4 flex items-center gap-3 transition-all active:scale-95 ${locked ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}`}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"
        style={{ background: color + "30", border: `2px solid ${color}40` }}
      >
        {locked ? "🔒" : emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-fredoka text-[#3D2B1F] text-base leading-tight">{title}</div>
        <div className="text-[#8B6A3E] text-xs font-nunito truncate">{description}</div>
      </div>
      <div className="text-[#C8A96E] text-lg">›</div>
    </Link>
  );
}

export default function HomePage() {
  const { config, loading } = useConfigurables();
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [dailyReward, setDailyReward] = useState<{ coins: number; streak: number } | null>(null);

  useEffect(() => {
    const profile = loadPlayer();
    const dailyCoins = config?.dailyLoginCoins ?? 50;
    const { profile: updated, claimedCoins, newStreak } = checkDailyLogin(profile, dailyCoins);
    setPlayer(updated);
    if (claimedCoins > 0) {
      setDailyReward({ coins: claimedCoins, streak: newStreak });
    }
  }, [config?.dailyLoginCoins]);

  if (loading || !player) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] honeycomb-bg flex items-center justify-center">
        <BeeAvatar size={80} />
      </div>
    );
  }

  const appName = config?.appName ?? "Spelling Bee Quest";
  const welcomeMsg = config?.welcomeMessage ?? "Welcome to Spelling Bee Quest!";
  const enableShop = config?.enableShop !== false;
  const enableMultiplayer = config?.enableMultiplayer !== false;

  const unlockedWorld = WORLDS.find((w) => player.level >= w.unlockLevel && w.id === "meadow");

  return (
    <div className="min-h-screen bg-[#FFF8E7] honeycomb-bg pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#3D2B1F] to-[#5C3D2E] pt-safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="font-fredoka text-[#F5C518] text-xl leading-tight">{appName}</h1>
            <p className="text-[#C8A96E] text-xs font-nunito">
              {config?.tagline ?? "Build words, earn honey!"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CoinDisplay amount={player.coins} size="sm" className="bg-[rgba(245,197,24,0.15)] px-2 py-1 rounded-full" />
            <Link to="/settings">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.1)] text-lg">⚙️</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero / Player Card */}
      <div className="px-4 py-4">
        <div className="game-card p-4 overflow-hidden relative" style={{ background: "linear-gradient(135deg, #FFF8E7, #FFF0C8)" }}>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 text-9xl opacity-5 pointer-events-none select-none font-bold">🐝</div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <BeeAvatar size={64} />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#F5C518] to-[#FF8C00] flex items-center justify-center shadow">
                <span className="font-bebas text-[#3D2B1F] text-xs font-bold">{player.level}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-fredoka text-[#3D2B1F] text-lg leading-tight">
                {player.username}
              </h2>
              <p className="text-[#8B6A3E] text-xs mb-2 font-nunito">
                🔥 {player.loginStreak}-day streak
              </p>
              <XPBar
                xp={player.xp}
                xpToNextLevel={player.xpToNextLevel}
                level={player.level}
                compact
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: "Words", value: player.stats.totalWordsSubmitted.toLocaleString(), emoji: "📝" },
              { label: "Best Score", value: player.stats.bestScore.toLocaleString(), emoji: "🏆" },
              { label: "Games", value: player.stats.gamesPlayed.toLocaleString(), emoji: "🎮" },
            ].map((stat) => (
              <div key={stat.label} className="text-center bg-[#FFF8E7] rounded-xl py-2 border border-[#E8C87A]/40">
                <div className="text-lg">{stat.emoji}</div>
                <div className="font-bebas text-[#3D2B1F] text-base leading-tight">{stat.value}</div>
                <div className="text-[#8B6A3E] text-[10px] font-nunito">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="px-4 mb-2">
        <p className="text-[#8B6A3E] text-sm font-nunito text-center">{welcomeMsg}</p>
      </div>

      {/* Quick Play */}
      <div className="px-4 mb-4">
        <Link
          to="/game"
          className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-xl font-fredoka shadow-xl"
          style={{ background: "linear-gradient(135deg, #F5C518, #FF8C00)", borderBottom: "4px solid #C87000", borderRadius: 28 }}
        >
          <span>🎮</span>
          <span>Play Now!</span>
          <span>🐝</span>
        </Link>
      </div>

      {/* Game Modes */}
      <div className="px-4">
        <h2 className="font-fredoka text-[#3D2B1F] text-lg mb-3">Game Modes</h2>
        <div className="space-y-2">
          <QuickModeCard
            emoji="🗺️"
            title="Adventure Mode"
            description="Explore worlds and conquer stages"
            href="/worldmap"
            color="#4CAF50"
          />
          {config?.enableDailyChallenge !== false && (
            <QuickModeCard
              emoji="📅"
              title="Daily Challenge"
              description="Today's special word challenge"
              href="/game?mode=daily"
              color="#64B5F6"
            />
          )}
          <QuickModeCard
            emoji="⏱️"
            title="Timed Mode"
            description="Race against the clock"
            href="/game?mode=timed"
            color="#FF8C00"
          />
          <QuickModeCard
            emoji="♾️"
            title="Endless Mode"
            description="Play until you decide to stop"
            href="/game?mode=endless"
            color="#9C27B0"
          />
          <QuickModeCard
            emoji="🎓"
            title="Practice Mode"
            description="No pressure, just learn"
            href="/game?mode=practice"
            color="#4CAF50"
          />
          {enableMultiplayer && (
            <QuickModeCard
              emoji="🏆"
              title="Leaderboards"
              description="Compete with players worldwide"
              href="/leaderboard"
              color="#F5C518"
            />
          )}
        </div>
      </div>

      {/* Daily Quests Preview */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-fredoka text-[#3D2B1F] text-lg">Daily Quests</h2>
          <Link to="/quests" className="text-[#FF8C00] text-sm font-nunito font-semibold">See All →</Link>
        </div>
        <div className="space-y-2">
          {player.dailyQuests.slice(0, 2).map((quest) => {
            const pct = Math.min((quest.current / quest.target) * 100, 100);
            return (
              <div key={quest.id} className="game-card p-3 flex items-center gap-3">
                <div className="text-2xl">{quest.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-nunito font-semibold text-[#3D2B1F] text-sm">{quest.title}</span>
                    <span className="text-[#8B6A3E] text-xs font-nunito">{quest.current}/{quest.target}</span>
                  </div>
                  <div className="h-2 bg-[#E8D5A3] rounded-full overflow-hidden">
                    <div className="progress-honey h-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                {quest.completed && !quest.claimed && (
                  <Link to="/quests" className="text-xs bg-gradient-to-r from-[#F5C518] to-[#FF8C00] text-[#3D2B1F] font-bold px-2 py-1 rounded-full flex-shrink-0">
                    Claim!
                  </Link>
                )}
                {quest.claimed && <span className="text-green-500 text-lg">✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Shop + Achievements links */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3 mb-2">
        {enableShop && (
          <Link to="/shop" className="game-card p-4 text-center hover:shadow-lg transition-all active:scale-95">
            <div className="text-3xl mb-1">🛒</div>
            <div className="font-fredoka text-[#3D2B1F] text-base">Shop</div>
            <div className="text-[#8B6A3E] text-xs font-nunito">Power-ups & more</div>
          </Link>
        )}
        <Link to="/achievements" className="game-card p-4 text-center hover:shadow-lg transition-all active:scale-95">
          <div className="text-3xl mb-1">🏅</div>
          <div className="font-fredoka text-[#3D2B1F] text-base">Achievements</div>
          <div className="text-[#8B6A3E] text-xs font-nunito">{player.achievements.length} earned</div>
        </Link>
      </div>

      {/* Bottom Nav */}
      <BottomNav />

      {/* Daily Login Modal */}
      {dailyReward && (
        <DailyLoginModal
          coins={dailyReward.coins}
          streak={dailyReward.streak}
          onClose={() => setDailyReward(null)}
        />
      )}
    </div>
  );
}
