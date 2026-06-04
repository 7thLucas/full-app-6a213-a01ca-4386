// ── Letter Distribution & Values (Scrabble-based + bee bonuses) ─────────────
export const LETTER_POOL: { letter: string; count: number; value: number }[] = [
  { letter: "A", count: 9, value: 1 },
  { letter: "B", count: 2, value: 3 },
  { letter: "C", count: 2, value: 3 },
  { letter: "D", count: 4, value: 2 },
  { letter: "E", count: 12, value: 1 },
  { letter: "F", count: 2, value: 4 },
  { letter: "G", count: 3, value: 2 },
  { letter: "H", count: 2, value: 4 },
  { letter: "I", count: 9, value: 1 },
  { letter: "J", count: 1, value: 8 },
  { letter: "K", count: 1, value: 5 },
  { letter: "L", count: 4, value: 1 },
  { letter: "M", count: 2, value: 3 },
  { letter: "N", count: 6, value: 1 },
  { letter: "O", count: 8, value: 1 },
  { letter: "P", count: 2, value: 3 },
  { letter: "Q", count: 1, value: 10 },
  { letter: "R", count: 6, value: 1 },
  { letter: "S", count: 4, value: 1 },
  { letter: "T", count: 6, value: 1 },
  { letter: "U", count: 4, value: 1 },
  { letter: "V", count: 2, value: 4 },
  { letter: "W", count: 2, value: 4 },
  { letter: "X", count: 1, value: 8 },
  { letter: "Y", count: 2, value: 4 },
  { letter: "Z", count: 1, value: 10 },
  { letter: "B", count: 1, value: 6 }, // Bee bonus "B" tile
];

export const LETTER_VALUES: Record<string, number> = Object.fromEntries(
  LETTER_POOL.map(({ letter, value }) => [letter, value])
);

// ── Board Bonus Cell Types ────────────────────────────────────────────────
export type BonusType = "DW" | "TW" | "DL" | "TL" | "HP" | "CENTER" | null;

// 15x15 board bonus positions (row, col) -> BonusType
export const BOARD_BONUSES: BonusType[][] = (() => {
  const board: BonusType[][] = Array.from({ length: 15 }, () => Array(15).fill(null));

  // Triple Word (TW) - corners and edges
  const twPositions = [
    [0,0],[0,7],[0,14],[7,0],[7,14],[14,0],[14,7],[14,14]
  ];
  for (const [r, c] of twPositions) board[r][c] = "TW";

  // Double Word (DW) - diagonals
  const dwPositions = [
    [1,1],[2,2],[3,3],[4,4],[1,13],[2,12],[3,11],[4,10],
    [10,4],[11,3],[12,2],[13,1],[10,10],[11,11],[12,12],[13,13]
  ];
  for (const [r, c] of dwPositions) board[r][c] = "DW";

  // Triple Letter (TL)
  const tlPositions = [
    [1,5],[1,9],[5,1],[5,5],[5,9],[5,13],
    [9,1],[9,5],[9,9],[9,13],[13,5],[13,9]
  ];
  for (const [r, c] of tlPositions) board[r][c] = "TL";

  // Double Letter (DL)
  const dlPositions = [
    [0,3],[0,11],[2,6],[2,8],[3,0],[3,7],[3,14],
    [6,2],[6,6],[6,8],[6,12],[7,3],[7,11],
    [8,2],[8,6],[8,8],[8,12],[11,0],[11,7],[11,14],
    [12,6],[12,8],[14,3],[14,11]
  ];
  for (const [r, c] of dlPositions) board[r][c] = "DL";

  // Honey Pot (HP) - special bee bonus
  const hpPositions = [
    [2,2],[2,12],[12,2],[12,12]
  ];
  for (const [r, c] of hpPositions) board[r][c] = "HP";

  // Center
  board[7][7] = "CENTER";

  return board;
})();

// ── Game Modes ────────────────────────────────────────────────────────────
export type GameMode = "adventure" | "daily" | "timed" | "endless" | "practice";

// ── World Data ────────────────────────────────────────────────────────────
export interface WorldData {
  id: string;
  name: string;
  emoji: string;
  description: string;
  gradient: string;
  stages: number;
  unlockLevel: number;
  color: string;
}

export const WORLDS: WorldData[] = [
  {
    id: "meadow",
    name: "Honeybee Meadow",
    emoji: "🌸",
    description: "Where the bees first learned to spell!",
    gradient: "from-yellow-100 to-green-100",
    stages: 5,
    unlockLevel: 1,
    color: "#4CAF50",
  },
  {
    id: "forest",
    name: "Enchanted Forest",
    emoji: "🌳",
    description: "Ancient trees hold ancient words.",
    gradient: "from-green-200 to-emerald-300",
    stages: 8,
    unlockLevel: 5,
    color: "#2E7D32",
  },
  {
    id: "ocean",
    name: "Crystal Ocean",
    emoji: "🌊",
    description: "Dive deep into aquatic vocabulary!",
    gradient: "from-blue-100 to-cyan-200",
    stages: 8,
    unlockLevel: 10,
    color: "#1565C0",
  },
  {
    id: "twilight",
    name: "Twilight Valley",
    emoji: "🌙",
    description: "Words glow like fireflies at dusk.",
    gradient: "from-purple-100 to-indigo-200",
    stages: 10,
    unlockLevel: 18,
    color: "#6A1B9A",
  },
  {
    id: "volcano",
    name: "Volcano Peak",
    emoji: "🌋",
    description: "Scorching wordplay challenges await!",
    gradient: "from-red-100 to-orange-200",
    stages: 10,
    unlockLevel: 28,
    color: "#C62828",
  },
];

// ── Power-up Definitions ──────────────────────────────────────────────────
export interface PowerUpDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
  cost: number;
  color: string;
}

export const POWER_UPS: PowerUpDefinition[] = [
  {
    id: "reveal",
    name: "Reveal Letter",
    description: "Reveals one unplaced letter's best position",
    emoji: "🔍",
    cost: 50,
    color: "#64B5F6",
  },
  {
    id: "shuffle",
    name: "Shuffle Tiles",
    description: "Shuffles your tile rack for fresh options",
    emoji: "🔀",
    cost: 30,
    color: "#FF8C00",
  },
  {
    id: "highlight",
    name: "Highlight Words",
    description: "Highlights all valid word positions",
    emoji: "✨",
    cost: 80,
    color: "#F5C518",
  },
  {
    id: "double",
    name: "Double Score",
    description: "Doubles the score of your next word",
    emoji: "⚡",
    cost: 120,
    color: "#FF5252",
  },
  {
    id: "time_ext",
    name: "Time Extension",
    description: "Adds 30 seconds in timed modes",
    emoji: "⏰",
    cost: 60,
    color: "#4CAF50",
  },
];

// ── Achievement Definitions ───────────────────────────────────────────────
export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
  xpReward: number;
  coinReward: number;
  category: "words" | "score" | "streak" | "quest" | "special";
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: "first_word", name: "First Buzz", description: "Submit your first word", emoji: "🐝", xpReward: 20, coinReward: 50, category: "words" },
  { id: "word_10", name: "Busy Bee", description: "Submit 10 words", emoji: "🌸", xpReward: 50, coinReward: 100, category: "words" },
  { id: "word_100", name: "Word Weaver", description: "Submit 100 words", emoji: "🕸️", xpReward: 200, coinReward: 500, category: "words" },
  { id: "word_1000", name: "Lexicon Master", description: "Submit 1000 words", emoji: "📚", xpReward: 1000, coinReward: 2000, category: "words" },
  { id: "score_100", name: "Sweet Score", description: "Score 100 points in a game", emoji: "🍯", xpReward: 75, coinReward: 150, category: "score" },
  { id: "score_500", name: "Golden Harvest", description: "Score 500 points in a game", emoji: "🏆", xpReward: 300, coinReward: 600, category: "score" },
  { id: "streak_3", name: "3-Day Streak", description: "Login 3 days in a row", emoji: "🔥", xpReward: 60, coinReward: 120, category: "streak" },
  { id: "streak_7", name: "Week Warrior", description: "Login 7 days in a row", emoji: "💪", xpReward: 150, coinReward: 300, category: "streak" },
  { id: "streak_30", name: "Honey Devotee", description: "Login 30 days in a row", emoji: "👑", xpReward: 500, coinReward: 1000, category: "streak" },
  { id: "world_1", name: "Meadow Graduate", description: "Complete Honeybee Meadow", emoji: "🌸", xpReward: 200, coinReward: 400, category: "quest" },
  { id: "long_word", name: "Big Words", description: "Submit a word with 8+ letters", emoji: "📏", xpReward: 100, coinReward: 200, category: "special" },
  { id: "perfect_game", name: "Perfect Hive", description: "Complete a game without errors", emoji: "⭐", xpReward: 250, coinReward: 500, category: "special" },
];

// ── XP Requirements per Level ─────────────────────────────────────────────
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.35, level - 1));
}

// ── Shop Items ───────────────────────────────────────────────────────────
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  price: number;
  type: "powerup" | "cosmetic" | "chest";
  quantity?: number;
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: "chest_small", name: "Honey Chest", description: "Contains coins + boosters", emoji: "📦", price: 100, type: "chest" },
  { id: "chest_large", name: "Royal Hive Chest", description: "Premium rewards inside!", emoji: "🏆", price: 350, type: "chest" },
  { id: "powerup_reveal_3", name: "Reveal Pack ×3", description: "3x Reveal Letter power-ups", emoji: "🔍", price: 120, type: "powerup", quantity: 3 },
  { id: "powerup_shuffle_5", name: "Shuffle Pack ×5", description: "5x Shuffle Tiles", emoji: "🔀", price: 120, type: "powerup", quantity: 5 },
  { id: "powerup_double_2", name: "Double Score ×2", description: "2x Double Score power-ups", emoji: "⚡", price: 200, type: "powerup", quantity: 2 },
  { id: "skin_golden", name: "Golden Hive Skin", description: "Shimmering gold board skin", emoji: "✨", price: 500, type: "cosmetic" },
  { id: "skin_ocean", name: "Ocean Board Skin", description: "Cool oceanic board theme", emoji: "🌊", price: 500, type: "cosmetic" },
  { id: "tile_crystal", name: "Crystal Tiles", description: "Sparkling crystal letter tiles", emoji: "💎", price: 800, type: "cosmetic" },
];

// ── Daily Quest Templates ─────────────────────────────────────────────────
export interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  emoji: string;
  target: number;
  coinReward: number;
  xpReward: number;
  type: "words" | "score" | "letters" | "game";
}

export const DAILY_QUEST_POOL: QuestTemplate[] = [
  { id: "play_games", title: "Game Time", description: "Play {n} games", emoji: "🎮", target: 3, coinReward: 80, xpReward: 40, type: "game" },
  { id: "submit_words", title: "Word Hunter", description: "Submit {n} valid words", emoji: "📝", target: 10, coinReward: 100, xpReward: 50, type: "words" },
  { id: "score_total", title: "Score Collector", description: "Earn {n} total points", emoji: "🎯", target: 200, coinReward: 120, xpReward: 60, type: "score" },
  { id: "use_letters", title: "Letter Master", description: "Use the letter {l} in {n} words", emoji: "🅱️", target: 3, coinReward: 60, xpReward: 30, type: "letters" },
  { id: "long_words", title: "Big Speller", description: "Submit {n} words with 6+ letters", emoji: "📏", target: 3, coinReward: 90, xpReward: 45, type: "words" },
];
