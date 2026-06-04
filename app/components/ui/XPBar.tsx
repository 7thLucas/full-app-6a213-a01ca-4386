import { cn } from "~/lib/utils";

interface XPBarProps {
  xp: number;
  xpToNextLevel: number;
  level: number;
  className?: string;
  compact?: boolean;
}

export function XPBar({ xp, xpToNextLevel, level, className, compact = false }: XPBarProps) {
  const pct = Math.min((xp / xpToNextLevel) * 100, 100);

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#F5C518] to-[#FF8C00] flex items-center justify-center">
          <span className="text-[#3D2B1F] font-bebas text-xs font-bold">{level}</span>
        </div>
        <div className="flex-1 h-2 bg-[#E8D5A3] rounded-full overflow-hidden">
          <div
            className="progress-honey h-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-xs text-[#8B6A3E] font-nunito font-semibold">
        <span>Level {level}</span>
        <span>{xp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP</span>
      </div>
      <div className="h-3 bg-[#E8D5A3] rounded-full overflow-hidden">
        <div
          className="progress-honey h-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
