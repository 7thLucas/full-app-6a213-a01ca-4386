import { cn } from "~/lib/utils";

interface CoinDisplayProps {
  amount: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export function CoinDisplay({ amount, className, size = "md", animate = false }: CoinDisplayProps) {
  const sizeClasses = {
    sm: "text-sm gap-1",
    md: "text-base gap-1.5",
    lg: "text-xl gap-2",
  };
  const iconSizes = { sm: 16, md: 20, lg: 28 };

  return (
    <div className={cn("flex items-center font-bebas tracking-wide", sizeClasses[size], animate && "animate-pulse-gold", className)}>
      <span style={{ fontSize: iconSizes[size] }}>🪙</span>
      <span className="text-[#3D2B1F] font-bold">{amount.toLocaleString()}</span>
    </div>
  );
}
