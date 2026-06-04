import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { loadPlayer, savePlayer, createDefaultProfile, type PlayerProfile } from "~/game/player-store";
import { BottomNav, TopBar } from "~/components/ui/BottomNav";
import { cn } from "~/lib/utils";

function ToggleSetting({
  label,
  description,
  emoji,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  emoji: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{emoji}</div>
        <div>
          <div className="font-nunito font-semibold text-[#3D2B1F] text-sm">{label}</div>
          {description && <div className="text-[#8B6A3E] text-xs font-nunito">{description}</div>}
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          "w-12 h-6 rounded-full transition-all relative",
          value ? "bg-gradient-to-r from-[#F5C518] to-[#FF8C00]" : "bg-[#C8A96E]/40"
        )}
        role="switch"
        aria-checked={value}
      >
        <div
          className={cn(
            "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all",
            value ? "right-0.5" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { config } = useConfigurables();
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setPlayer(loadPlayer());
    setSoundEnabled(localStorage.getItem("sbq_sound") !== "false");
    setMusicEnabled(localStorage.getItem("sbq_music") !== "false");
    setVibrationEnabled(localStorage.getItem("sbq_vibration") !== "false");
    setNotificationsEnabled(localStorage.getItem("sbq_notifications") !== "false");
  }, []);

  const handleToggle = (key: string, value: boolean) => {
    localStorage.setItem(key, String(value));
    if (key === "sbq_sound") setSoundEnabled(value);
    if (key === "sbq_music") setMusicEnabled(value);
    if (key === "sbq_vibration") setVibrationEnabled(value);
    if (key === "sbq_notifications") setNotificationsEnabled(value);
  };

  const handleReset = () => {
    const fresh = createDefaultProfile();
    savePlayer(fresh);
    localStorage.removeItem("sbq_daily_claimed");
    setPlayer(fresh);
    setShowResetConfirm(false);
    window.location.href = "/";
  };

  if (!player) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
        <div className="text-4xl animate-bee-float">🐝</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7] pb-24">
      <TopBar title="Settings ⚙️" showBack />

      <div className="px-4 py-4 space-y-4">
        {/* Audio */}
        <div className="game-card divide-y divide-[#E8C87A]/30">
          <div className="px-4 py-2">
            <h2 className="font-fredoka text-[#3D2B1F] text-base">Audio</h2>
          </div>
          <ToggleSetting
            label="Sound Effects"
            description="Tile placement, word submit sounds"
            emoji="🔊"
            value={soundEnabled}
            onChange={(v) => handleToggle("sbq_sound", v)}
          />
          <ToggleSetting
            label="Background Music"
            description="Game background music"
            emoji="🎵"
            value={musicEnabled}
            onChange={(v) => handleToggle("sbq_music", v)}
          />
          <ToggleSetting
            label="Vibration"
            description="Haptic feedback on mobile"
            emoji="📳"
            value={vibrationEnabled}
            onChange={(v) => handleToggle("sbq_vibration", v)}
          />
        </div>

        {/* Notifications */}
        <div className="game-card divide-y divide-[#E8C87A]/30">
          <div className="px-4 py-2">
            <h2 className="font-fredoka text-[#3D2B1F] text-base">Notifications</h2>
          </div>
          <ToggleSetting
            label="Daily Quest Reminders"
            description="Get reminded to complete daily quests"
            emoji="📋"
            value={notificationsEnabled}
            onChange={(v) => handleToggle("sbq_notifications", v)}
          />
        </div>

        {/* Account */}
        <div className="game-card divide-y divide-[#E8C87A]/30">
          <div className="px-4 py-2">
            <h2 className="font-fredoka text-[#3D2B1F] text-base">Account</h2>
          </div>
          <Link to="/auth/login" className="flex items-center gap-3 p-4 hover:bg-[#FFF8E7] transition-colors">
            <div className="text-2xl">🔐</div>
            <div>
              <div className="font-nunito font-semibold text-[#3D2B1F] text-sm">Sign In / Register</div>
              <div className="text-[#8B6A3E] text-xs font-nunito">Save progress to cloud</div>
            </div>
            <div className="ml-auto text-[#C8A96E]">›</div>
          </Link>
        </div>

        {/* About */}
        <div className="game-card divide-y divide-[#E8C87A]/30">
          <div className="px-4 py-2">
            <h2 className="font-fredoka text-[#3D2B1F] text-base">About</h2>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">🐝</div>
              <div>
                <div className="font-fredoka text-[#3D2B1F] text-base">
                  {config?.appName ?? "Spelling Bee Quest"}
                </div>
                <div className="text-[#8B6A3E] text-xs font-nunito">Version 1.0.0</div>
              </div>
            </div>
            <p className="text-[#8B6A3E] text-xs font-nunito leading-relaxed">
              {config?.tagline ?? "Build words, earn honey, conquer the hive!"}
            </p>
          </div>
          {config?.socialLinks?.twitter && (
            <a href={config.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4">
              <div className="text-2xl">🐦</div>
              <span className="font-nunito text-[#3D2B1F] text-sm">Follow on Twitter</span>
              <div className="ml-auto text-[#C8A96E]">›</div>
            </a>
          )}
        </div>

        {/* Footer Text */}
        {config?.footerText && (
          <p className="text-center text-[#8B6A3E] text-xs font-nunito py-2">{config.footerText}</p>
        )}

        {/* Danger Zone */}
        <div className="game-card border-2 border-[#FF5252]/30">
          <div className="px-4 py-2">
            <h2 className="font-fredoka text-[#FF5252] text-base">Danger Zone</h2>
          </div>
          <div className="p-4">
            <p className="text-[#8B6A3E] text-xs font-nunito mb-3">
              This will permanently erase all your progress, coins, and achievements.
            </p>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-3 rounded-full font-nunito font-bold text-sm text-[#FF5252] border-2 border-[#FF5252]/50 hover:bg-[#FF5252]/5 transition-colors"
            >
              Reset All Progress
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirm Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="game-card mx-4 w-full max-w-sm p-6 text-center animate-pop-in">
            <div className="text-5xl mb-3">⚠️</div>
            <h2 className="font-fredoka text-[#3D2B1F] text-xl mb-2">Reset All Progress?</h2>
            <p className="text-[#8B6A3E] text-sm font-nunito mb-4">
              This cannot be undone. All coins, achievements, and level progress will be lost.
            </p>
            <div className="space-y-2">
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-full font-nunito font-bold text-sm bg-[#FF5252] text-white border-b-2 border-[#C73232]"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="w-full py-3 text-[#8B6A3E] font-nunito font-semibold text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
