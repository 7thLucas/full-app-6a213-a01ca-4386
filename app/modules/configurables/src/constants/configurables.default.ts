/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
  background?: string;
  success?: string;
  alert?: string;
};

export type TSocialLinks = {
  twitter?: string;
  instagram?: string;
  facebook?: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  tagline?: string;
  logoUrl: string;
  brandColor: TBrandColor;
  welcomeMessage?: string;
  welcomeSubtitle?: string;
  enableDailyChallenge?: boolean;
  enableMultiplayer?: boolean;
  enableShop?: boolean;
  dailyLoginCoins?: number;
  startingCoins?: number;
  gameModes?: string[];
  socialLinks?: TSocialLinks;
  footerText?: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Spelling Bee Quest",
  tagline: "Build words, earn honey, conquer the hive!",
  logoUrl: "FILL_LOGO_URL_HERE",
  brandColor: {
    primary: "#F5C518",
    secondary: "#FF8C00",
    accent: "#3D2B1F",
    background: "#FFF8E7",
    success: "#4CAF50",
    alert: "#FF5252",
  },
  welcomeMessage: "Welcome to Spelling Bee Quest!",
  welcomeSubtitle: "Build words, earn coins, and become the ultimate Word Bee!",
  enableDailyChallenge: true,
  enableMultiplayer: true,
  enableShop: true,
  dailyLoginCoins: 50,
  startingCoins: 200,
  gameModes: ["Adventure", "Daily Challenge", "Timed Mode", "Endless Mode", "Practice"],
  socialLinks: {
    twitter: "",
    instagram: "",
    facebook: "",
  },
  footerText: "© 2026 Spelling Bee Quest. All rights reserved.",
};
