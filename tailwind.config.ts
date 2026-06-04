import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", "class"],
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ["'Fredoka One'", "cursive"],
        nunito: ["'Nunito'", "sans-serif"],
        bebas: ["'Bebas Neue'", "cursive"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Bee game palette
        honey: "#F5C518",
        amber: "#FF8C00",
        cream: "#FFF8E7",
        hive: "#3D2B1F",
        "garden-green": "#4CAF50",
        "sky-blue": "#64B5F6",
        "coral-red": "#FF5252",
        "board-bg": "#E8D5A3",
        "tile-bg": "#F7E87C",
        "bonus-dw": "#FFB3C6",
        "bonus-tl": "#80CBC4",
        "honey-pot": "#FFD700",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        navbar: {
          DEFAULT: "var(--navbar-background)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "bee-float": {
          "0%, 100%": { transform: "translateY(0px) rotate(-2deg)" },
          "50%": { transform: "translateY(-12px) rotate(2deg)" },
        },
        "tile-bounce": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.12)" },
          "70%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        "tile-shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px) rotate(-2deg)" },
          "40%": { transform: "translateX(6px) rotate(2deg)" },
          "60%": { transform: "translateX(-4px) rotate(-1deg)" },
          "80%": { transform: "translateX(4px) rotate(1deg)" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "70%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245,197,24,0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(245,197,24,0)" },
        },
        "spin-slow": {
          "from": { transform: "rotate(0deg)" },
          "to": { transform: "rotate(360deg)" },
        },
        "confetti-fall": {
          "0%": { transform: "translateY(-20px) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
        "glow-ripple": {
          "0%": { boxShadow: "0 0 0 0 rgba(245, 197, 24, 0.7)" },
          "70%": { boxShadow: "0 0 0 16px rgba(245, 197, 24, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(245, 197, 24, 0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bee-float": "bee-float 3s ease-in-out infinite",
        "tile-bounce": "tile-bounce 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "tile-shake": "tile-shake 0.4s ease-in-out",
        "pop-in": "pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "slide-up": "slide-up 0.3s ease-out forwards",
        "shimmer": "shimmer 1.5s linear infinite",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "confetti-fall": "confetti-fall 2s ease-in forwards",
        "glow-ripple": "glow-ripple 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
