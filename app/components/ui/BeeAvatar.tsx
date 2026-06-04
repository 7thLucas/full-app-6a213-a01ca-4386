import { cn } from "~/lib/utils";

interface BeeAvatarProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function BeeAvatar({ size = 80, className, animate = true }: BeeAvatarProps) {
  return (
    <div
      className={cn("inline-flex items-center justify-center", animate && "animate-bee-float", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {/* Wings */}
        <ellipse cx="28" cy="38" rx="18" ry="10" fill="rgba(200,230,255,0.85)" stroke="#99CCFF" strokeWidth="1" style={{ transformOrigin: "38px 38px" }} className={animate ? "animate-wing-flutter" : ""} />
        <ellipse cx="72" cy="38" rx="18" ry="10" fill="rgba(200,230,255,0.85)" stroke="#99CCFF" strokeWidth="1" style={{ transformOrigin: "62px 38px" }} className={animate ? "animate-wing-flutter" : ""} />

        {/* Body */}
        <ellipse cx="50" cy="62" rx="22" ry="28" fill="#F5C518" />

        {/* Stripes */}
        <ellipse cx="50" cy="60" rx="22" ry="6" fill="#3D2B1F" />
        <ellipse cx="50" cy="72" rx="21" ry="6" fill="#3D2B1F" />

        {/* Head */}
        <circle cx="50" cy="32" r="20" fill="#F5C518" />

        {/* Eyes */}
        <circle cx="43" cy="28" r="5" fill="white" />
        <circle cx="57" cy="28" r="5" fill="white" />
        <circle cx="44" cy="29" r="3" fill="#1A1A1A" />
        <circle cx="58" cy="29" r="3" fill="#1A1A1A" />
        {/* Eye shine */}
        <circle cx="45" cy="28" r="1" fill="white" />
        <circle cx="59" cy="28" r="1" fill="white" />

        {/* Smile */}
        <path d="M 42 38 Q 50 44 58 38" fill="none" stroke="#3D2B1F" strokeWidth="2.5" strokeLinecap="round" />

        {/* Antennae */}
        <line x1="44" y1="14" x2="35" y2="4" stroke="#3D2B1F" strokeWidth="2" strokeLinecap="round" />
        <circle cx="35" cy="4" r="3" fill="#FF8C00" />
        <line x1="56" y1="14" x2="65" y2="4" stroke="#3D2B1F" strokeWidth="2" strokeLinecap="round" />
        <circle cx="65" cy="4" r="3" fill="#FF8C00" />

        {/* Stinger */}
        <path d="M 50 89 L 46 97 L 54 97 Z" fill="#3D2B1F" />
      </svg>
    </div>
  );
}
