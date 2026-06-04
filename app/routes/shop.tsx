import { useState, useEffect } from "react";
import { useConfigurables } from "~/modules/configurables";
import { loadPlayer, savePlayer, type PlayerProfile } from "~/game/player-store";
import { SHOP_ITEMS, POWER_UPS, type ShopItem } from "~/game/constants";
import { BottomNav, TopBar } from "~/components/ui/BottomNav";
import { cn } from "~/lib/utils";

type TabType = "featured" | "powerups" | "cosmetics" | "chests";

function ShopItemCard({
  item,
  canAfford,
  owned,
  onBuy,
  buying,
}: {
  item: ShopItem;
  canAfford: boolean;
  owned: boolean;
  onBuy: (item: ShopItem) => void;
  buying: boolean;
}) {
  const [justBought, setJustBought] = useState(false);

  const handleBuy = () => {
    if (!canAfford || owned || buying) return;
    onBuy(item);
    setJustBought(true);
    setTimeout(() => setJustBought(false), 1500);
  };

  return (
    <div
      className={cn(
        "game-card p-4 transition-all",
        owned && "opacity-70"
      )}
    >
      <div className="text-4xl text-center mb-2">{item.emoji}</div>
      <h3 className="font-fredoka text-[#3D2B1F] text-base text-center mb-0.5">{item.name}</h3>
      <p className="text-[#8B6A3E] text-xs font-nunito text-center mb-3">{item.description}</p>

      {owned ? (
        <div className="w-full py-2 rounded-full text-center font-nunito font-semibold text-xs text-[#4CAF50] bg-[#4CAF50]/10 border border-[#4CAF50]/30">
          ✓ Owned
        </div>
      ) : justBought ? (
        <div className="w-full py-2 rounded-full text-center font-nunito font-semibold text-xs text-[#F5C518] bg-[#F5C518]/10 border border-[#F5C518]/30 animate-pop-in">
          ✓ Purchased!
        </div>
      ) : (
        <button
          onClick={handleBuy}
          disabled={!canAfford || buying}
          className={cn(
            "w-full py-2 rounded-full font-nunito font-bold text-sm transition-all",
            canAfford
              ? "bg-gradient-to-r from-[#F5C518] to-[#FF8C00] text-[#3D2B1F] border-b-2 border-[#C87000] active:border-b-0 hover:shadow-md"
              : "bg-[#E8D5A3] text-[#8B6A3E] cursor-not-allowed"
          )}
        >
          <span className="mr-1">🪙</span>
          {item.price.toLocaleString()}
        </button>
      )}
    </div>
  );
}

export default function ShopPage() {
  const { config } = useConfigurables();
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("featured");
  const [buying, setBuying] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setPlayer(loadPlayer());
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleBuy = (item: ShopItem) => {
    if (!player || player.coins < item.price || buying) return;
    setBuying(true);

    const updated = { ...player, coins: player.coins - item.price };

    if (item.type === "powerup") {
      const powerupId = POWER_UPS.find((p) => item.id.includes(p.id))?.id ?? item.id;
      const qty = item.quantity ?? 1;
      updated.inventory = {
        ...updated.inventory,
        powerups: {
          ...updated.inventory.powerups,
          [powerupId]: (updated.inventory.powerups[powerupId] ?? 0) + qty,
        },
      };
      showToast(`Got ${item.name}!`);
    } else if (item.type === "cosmetic") {
      updated.inventory = {
        ...updated.inventory,
        cosmetics: [...(updated.inventory.cosmetics ?? []), item.id],
      };
      showToast(`${item.name} unlocked!`);
    } else if (item.type === "chest") {
      // Open chest - random rewards
      const coinsFound = Math.floor(Math.random() * 200) + 100;
      updated.coins += coinsFound;
      showToast(`Opened! Found 🪙 ${coinsFound} + bonus items!`);
    }

    savePlayer(updated);
    setPlayer(updated);
    setBuying(false);
  };

  if (!player) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
        <div className="text-4xl animate-bee-float">🐝</div>
      </div>
    );
  }

  const tabs: { key: TabType; label: string; emoji: string }[] = [
    { key: "featured", label: "Featured", emoji: "⭐" },
    { key: "powerups", label: "Power-ups", emoji: "⚡" },
    { key: "cosmetics", label: "Cosmetics", emoji: "✨" },
    { key: "chests", label: "Chests", emoji: "📦" },
  ];

  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (activeTab === "featured") return true;
    if (activeTab === "powerups") return item.type === "powerup";
    if (activeTab === "cosmetics") return item.type === "cosmetic";
    if (activeTab === "chests") return item.type === "chest";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FFF8E7] pb-24">
      <TopBar title="Shop 🛒" coins={player.coins} />

      {/* Toast */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-pop-in">
          <div className="bg-[#4CAF50] text-white px-6 py-3 rounded-2xl shadow-xl font-fredoka text-lg">
            {toast}
          </div>
        </div>
      )}

      {/* Coin Banner */}
      <div className="bg-gradient-to-r from-[#3D2B1F] to-[#5C3D2E] px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[#C8A96E] text-xs font-nunito">Your Balance</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪙</span>
            <span className="font-bebas text-[#F5C518] text-2xl">{player.coins.toLocaleString()}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[#C8A96E] text-xs font-nunito">Earn more by</p>
          <p className="text-white text-xs font-nunito">playing games!</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-nunito font-semibold text-sm transition-all",
              activeTab === tab.key
                ? "bg-gradient-to-r from-[#F5C518] to-[#FF8C00] text-[#3D2B1F] shadow-md"
                : "bg-white text-[#8B6A3E] border border-[#E8C87A]/60"
            )}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {filteredItems.map((item) => {
          const isOwned = item.type === "cosmetic" && player.inventory.cosmetics?.includes(item.id);
          return (
            <ShopItemCard
              key={item.id}
              item={item}
              canAfford={player.coins >= item.price}
              owned={isOwned}
              onBuy={handleBuy}
              buying={buying}
            />
          );
        })}
      </div>

      {/* "How to earn" section */}
      <div className="px-4 mt-4 mb-2">
        <div className="game-card p-4 bg-gradient-to-br from-[#FFF8E7] to-[#FFF0C8]">
          <h3 className="font-fredoka text-[#3D2B1F] text-base mb-3">How to Earn Coins 🪙</h3>
          <div className="space-y-2">
            {[
              { action: "Complete a game", reward: "Score ÷ 10 coins" },
              { action: "Daily login", reward: `${config?.dailyLoginCoins ?? 50}+ coins (streak bonus!)` },
              { action: "Complete quests", reward: "60–120 coins" },
              { action: "Earn achievements", reward: "50–2000 coins" },
              { action: "Level up", reward: "Level × 25 coins" },
            ].map((row) => (
              <div key={row.action} className="flex items-center justify-between text-sm">
                <span className="text-[#5C3D2E] font-nunito">{row.action}</span>
                <span className="text-[#FF8C00] font-nunito font-semibold">{row.reward}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
