import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { loadPlayer, savePlayer, type PlayerProfile } from "~/game/player-store";
import { POWER_UPS } from "~/game/constants";
import { BottomNav, TopBar } from "~/components/ui/BottomNav";
import { cn } from "~/lib/utils";

const COSMETICS_DATA: Record<string, { name: string; emoji: string; description: string }> = {
  skin_golden: { name: "Golden Hive", emoji: "✨", description: "Shimmering gold board skin" },
  skin_ocean: { name: "Ocean Board", emoji: "🌊", description: "Cool oceanic board theme" },
  tile_crystal: { name: "Crystal Tiles", emoji: "💎", description: "Sparkling crystal letter tiles" },
};

export default function InventoryPage() {
  const { config } = useConfigurables();
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [tab, setTab] = useState<"powerups" | "cosmetics">("powerups");

  useEffect(() => {
    setPlayer(loadPlayer());
  }, []);

  const handleEquipSkin = (skinId: string) => {
    if (!player) return;
    const updated = {
      ...player,
      inventory: {
        ...player.inventory,
        activeSkin: player.inventory.activeSkin === skinId ? null : skinId,
      },
    };
    savePlayer(updated);
    setPlayer(updated);
  };

  if (!player) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
        <div className="text-4xl animate-bee-float">🐝</div>
      </div>
    );
  }

  const totalPowerups = Object.values(player.inventory.powerups).reduce((a, b) => a + b, 0);
  const totalCosmetics = player.inventory.cosmetics?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#FFF8E7] pb-24">
      <TopBar title="Inventory 🎒" coins={player.coins} />

      {/* Tabs */}
      <div className="px-4 py-3 flex gap-2">
        <button
          onClick={() => setTab("powerups")}
          className={cn(
            "flex-1 py-2.5 rounded-full font-nunito font-semibold text-sm transition-all",
            tab === "powerups"
              ? "bg-gradient-to-r from-[#F5C518] to-[#FF8C00] text-[#3D2B1F] shadow-md"
              : "bg-white text-[#8B6A3E] border border-[#E8C87A]/60"
          )}
        >
          ⚡ Power-ups ({totalPowerups})
        </button>
        <button
          onClick={() => setTab("cosmetics")}
          className={cn(
            "flex-1 py-2.5 rounded-full font-nunito font-semibold text-sm transition-all",
            tab === "cosmetics"
              ? "bg-gradient-to-r from-[#F5C518] to-[#FF8C00] text-[#3D2B1F] shadow-md"
              : "bg-white text-[#8B6A3E] border border-[#E8C87A]/60"
          )}
        >
          ✨ Cosmetics ({totalCosmetics})
        </button>
      </div>

      <div className="px-4">
        {tab === "powerups" && (
          <div>
            <p className="text-[#8B6A3E] text-xs font-nunito mb-3">Use power-ups during gameplay from the game screen.</p>
            <div className="space-y-3">
              {POWER_UPS.map((pu) => {
                const qty = player.inventory.powerups[pu.id] ?? 0;
                return (
                  <div
                    key={pu.id}
                    className={cn(
                      "game-card p-4 flex items-center gap-4",
                      qty === 0 && "opacity-50"
                    )}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ background: pu.color + "25", border: `2px solid ${pu.color}40` }}
                    >
                      {pu.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-fredoka text-[#3D2B1F] text-base">{pu.name}</h3>
                      <p className="text-[#8B6A3E] text-xs font-nunito">{pu.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bebas text-[#3D2B1F] text-2xl">×{qty}</div>
                      {qty === 0 && (
                        <Link to="/shop" className="text-[#FF8C00] text-xs font-nunito font-semibold">
                          Buy →
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-fredoka text-base"
                style={{ background: "linear-gradient(135deg,#F5C518,#FF8C00)", color: "#3D2B1F", borderBottom: "3px solid #C87000" }}
              >
                🛒 Get More Power-ups
              </Link>
            </div>
          </div>
        )}

        {tab === "cosmetics" && (
          <div>
            <p className="text-[#8B6A3E] text-xs font-nunito mb-3">Equip skins to customize your game board appearance.</p>

            {totalCosmetics === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🪣</div>
                <p className="font-fredoka text-[#8B6A3E] text-xl">No cosmetics yet!</p>
                <p className="text-[#8B6A3E] text-sm font-nunito mt-1 mb-4">Visit the shop to get some.</p>
                <Link
                  to="/shop?tab=cosmetics"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-fredoka text-base"
                  style={{ background: "linear-gradient(135deg,#F5C518,#FF8C00)", color: "#3D2B1F", borderBottom: "3px solid #C87000" }}
                >
                  🛒 Visit Shop
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {player.inventory.cosmetics.map((cosId) => {
                  const cos = COSMETICS_DATA[cosId];
                  if (!cos) return null;
                  const isEquipped = player.inventory.activeSkin === cosId;
                  return (
                    <div
                      key={cosId}
                      className={cn(
                        "game-card p-4 flex items-center gap-4",
                        isEquipped && "border-2 border-[#F5C518]"
                      )}
                    >
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 bg-gradient-to-br from-[#FFF8E7] to-[#FFF0C8]">
                        {cos.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-fredoka text-[#3D2B1F] text-base">{cos.name}</h3>
                        <p className="text-[#8B6A3E] text-xs font-nunito">{cos.description}</p>
                      </div>
                      <button
                        onClick={() => handleEquipSkin(cosId)}
                        className={cn(
                          "px-4 py-2 rounded-full font-nunito font-semibold text-sm",
                          isEquipped
                            ? "bg-[#4CAF50] text-white"
                            : "bg-gradient-to-r from-[#F5C518] to-[#FF8C00] text-[#3D2B1F]"
                        )}
                      >
                        {isEquipped ? "✓ Equipped" : "Equip"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
