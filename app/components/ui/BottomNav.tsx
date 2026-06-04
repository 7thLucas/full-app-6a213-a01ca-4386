import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", emoji: "🏠" },
  { href: "/worldmap", label: "Map", emoji: "🗺️" },
  { href: "/game", label: "Play", emoji: "🎮", highlight: true },
  { href: "/quests", label: "Quests", emoji: "📋" },
  { href: "/profile", label: "Profile", emoji: "👤" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="nav-bottom fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2 safe-bottom">
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.href ||
          (item.href !== "/" && location.pathname.startsWith(item.href));

        if (item.highlight) {
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 -mt-6 relative",
                "w-14 h-14 rounded-full",
                "bg-gradient-to-br from-[#F5C518] to-[#FF8C00]",
                "shadow-lg border-4 border-[#3D2B1F]",
                "items-center justify-center flex",
                "transition-transform active:scale-95",
                isActive && "scale-110"
              )}
            >
              <span className="text-2xl leading-none">{item.emoji}</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all",
              isActive
                ? "text-[#F5C518]"
                : "text-[rgba(255,255,255,0.5)] hover:text-[rgba(255,255,255,0.8)]"
            )}
          >
            <span className="text-xl">{item.emoji}</span>
            <span className="text-[10px] font-nunito font-semibold">{item.label}</span>
            {isActive && (
              <div className="w-1 h-1 rounded-full bg-[#F5C518] mt-0.5" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function TopBar({
  title,
  coins,
  showBack = false,
  rightElement,
}: {
  title: string;
  coins?: number;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#3D2B1F] shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link to="/" className="text-[#F5C518] hover:scale-110 transition-transform mr-1">
              ←
            </Link>
          )}
          <h1 className="text-[#F5C518] font-fredoka text-xl">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          {coins !== undefined && (
            <div className="flex items-center gap-1 bg-[rgba(245,197,24,0.15)] px-2 py-1 rounded-full">
              <span className="text-sm">🪙</span>
              <span className="text-[#F5C518] font-bebas text-sm tracking-wide">{coins.toLocaleString()}</span>
            </div>
          )}
          {rightElement}
        </div>
      </div>
    </header>
  );
}
