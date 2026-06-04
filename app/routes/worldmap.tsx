import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { WORLDS } from "~/game/constants";
import { loadPlayer, type PlayerProfile } from "~/game/player-store";
import { BottomNav, TopBar } from "~/components/ui/BottomNav";
import { cn } from "~/lib/utils";

function StageButton({
  stage,
  worldId,
  completed,
  unlocked,
  bestScore,
  isCurrent,
}: {
  stage: number;
  worldId: string;
  completed: boolean;
  unlocked: boolean;
  bestScore?: number;
  isCurrent: boolean;
}) {
  if (!unlocked) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="w-12 h-12 rounded-full bg-[#C8A96E]/30 border-2 border-[#C8A96E]/40 flex items-center justify-center">
          <span className="text-[#8B6A3E] text-lg">🔒</span>
        </div>
        <span className="text-[#8B6A3E] text-xs font-nunito">{stage}</span>
      </div>
    );
  }

  return (
    <Link to={`/game?mode=adventure&world=${worldId}&stage=${stage}`} className="flex flex-col items-center gap-1 group">
      <div
        className={cn(
          "w-12 h-12 rounded-full border-3 flex items-center justify-center transition-all active:scale-95 group-hover:scale-110",
          completed
            ? "bg-gradient-to-br from-[#F5C518] to-[#FF8C00] border-[#C87000] shadow-md"
            : isCurrent
            ? "bg-white border-[#F5C518] shadow-lg animate-pulse-gold"
            : "bg-white border-[#C8A96E]"
        )}
        style={{ borderWidth: 3 }}
      >
        {completed ? (
          <span className="text-white text-lg">⭐</span>
        ) : isCurrent ? (
          <span className="text-[#3D2B1F] font-bebas text-sm">{stage}</span>
        ) : (
          <span className="text-[#8B6A3E] font-bebas text-sm">{stage}</span>
        )}
      </div>
      {bestScore && (
        <span className="text-[#8B6A3E] text-[10px] font-bebas">{bestScore}</span>
      )}
    </Link>
  );
}

export default function WorldMapPage() {
  const { config, loading } = useConfigurables();
  const [player, setPlayer] = useState<PlayerProfile | null>(null);

  useEffect(() => {
    setPlayer(loadPlayer());
  }, []);

  if (loading || !player) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
        <div className="text-4xl animate-bee-float">🐝</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7] pb-24">
      <TopBar title="World Map 🗺️" coins={player.coins} />

      <div className="px-4 py-4 space-y-4">
        {WORLDS.map((world) => {
          const isUnlocked = player.level >= world.unlockLevel;
          const stagesCompleted = player.worldProgress[world.id] ?? 0;
          const progressPct = (stagesCompleted / world.stages) * 100;

          return (
            <div
              key={world.id}
              className={cn(
                "game-card overflow-hidden",
                !isUnlocked && "opacity-60"
              )}
            >
              {/* World Header */}
              <div
                className={cn("p-4 relative", `bg-gradient-to-r ${world.gradient}`)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{world.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-fredoka text-xl text-[#3D2B1F]">{world.name}</h3>
                    <p className="text-[#5C3D2E] text-xs font-nunito">{world.description}</p>
                  </div>
                  {!isUnlocked ? (
                    <div className="text-right">
                      <div className="text-[#8B6A3E] text-lg">🔒</div>
                      <div className="text-[#8B6A3E] text-xs font-nunito">Lv.{world.unlockLevel}</div>
                    </div>
                  ) : (
                    <div className="text-right">
                      <div className="font-bebas text-[#3D2B1F] text-lg">{stagesCompleted}/{world.stages}</div>
                      <div className="text-[#5C3D2E] text-xs font-nunito">stages</div>
                    </div>
                  )}
                </div>

                {isUnlocked && (
                  <div className="mt-3">
                    <div className="h-2 bg-white/40 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${progressPct}%`, background: world.color }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Stages */}
              {isUnlocked && (
                <div className="p-4 bg-white">
                  <div className="flex items-center gap-4 flex-wrap">
                    {Array.from({ length: world.stages }, (_, i) => {
                      const stage = i + 1;
                      const completed = stage <= stagesCompleted;
                      const isCurrent = stage === stagesCompleted + 1;
                      const stageKey = `${world.id}-${stage}`;
                      const bestScore = player.stageScores[stageKey];

                      return (
                        <StageButton
                          key={stage}
                          stage={stage}
                          worldId={world.id}
                          completed={completed}
                          unlocked={completed || isCurrent}
                          bestScore={bestScore}
                          isCurrent={isCurrent}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
