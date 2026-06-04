import { ACHIEVEMENTS, xpForLevel, DAILY_QUEST_POOL } from "./constants";

// ── Player Profile Types ────────────────────────────────────────────────────
export interface PlayerInventory {
  powerups: Record<string, number>; // powerupId -> quantity
  cosmetics: string[];              // owned cosmetic ids
  activeSkin: string | null;
}

export interface QuestProgress {
  id: string;
  title: string;
  description: string;
  emoji: string;
  target: number;
  current: number;
  coinReward: number;
  xpReward: number;
  completed: boolean;
  claimed: boolean;
  type: string;
  expiresAt: string; // ISO date
}

export interface PlayerStats {
  totalWordsSubmitted: number;
  totalScore: number;
  bestScore: number;
  gamesPlayed: number;
  longestWord: string;
  highestWordScore: number;
  totalPlayTime: number; // seconds
}

export interface PlayerProfile {
  username: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  loginStreak: number;
  lastLoginDate: string; // ISO date
  achievements: string[]; // earned achievement ids
  inventory: PlayerInventory;
  stats: PlayerStats;
  dailyQuests: QuestProgress[];
  dailyQuestsDate: string; // ISO date (YYYY-MM-DD)
  worldProgress: Record<string, number>; // worldId -> stagesCompleted
  stageScores: Record<string, number>;   // "worldId-stage" -> best score
}

const STORAGE_KEY = "sbq_player";
const DAILY_COINS_KEY = "sbq_daily_claimed";

function generateDailyQuests(): QuestProgress[] {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString();
  // Pick 3 random quests
  const shuffled = [...DAILY_QUEST_POOL].sort(() => Math.random() - 0.5).slice(0, 3);
  return shuffled.map((q) => ({
    id: q.id + "_" + today,
    title: q.title,
    description: q.description.replace("{n}", String(q.target)).replace("{l}", "B"),
    emoji: q.emoji,
    target: q.target,
    current: 0,
    coinReward: q.coinReward,
    xpReward: q.xpReward,
    completed: false,
    claimed: false,
    type: q.type,
    expiresAt: tomorrow,
  }));
}

export function createDefaultProfile(): PlayerProfile {
  return {
    username: "Player",
    level: 1,
    xp: 0,
    xpToNextLevel: xpForLevel(1),
    coins: 200,
    loginStreak: 1,
    lastLoginDate: new Date().toISOString().split("T")[0],
    achievements: [],
    inventory: {
      powerups: {
        reveal: 2,
        shuffle: 3,
        highlight: 1,
        double: 1,
        time_ext: 2,
      },
      cosmetics: [],
      activeSkin: null,
    },
    stats: {
      totalWordsSubmitted: 0,
      totalScore: 0,
      bestScore: 0,
      gamesPlayed: 0,
      longestWord: "",
      highestWordScore: 0,
      totalPlayTime: 0,
    },
    dailyQuests: generateDailyQuests(),
    dailyQuestsDate: new Date().toISOString().split("T")[0],
    worldProgress: { meadow: 0 },
    stageScores: {},
  };
}

export function loadPlayer(): PlayerProfile {
  if (typeof window === "undefined") return createDefaultProfile();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const profile = createDefaultProfile();
      savePlayer(profile);
      return profile;
    }
    const profile: PlayerProfile = JSON.parse(raw);
    // Refresh daily quests if needed
    const today = new Date().toISOString().split("T")[0];
    if (profile.dailyQuestsDate !== today) {
      profile.dailyQuests = generateDailyQuests();
      profile.dailyQuestsDate = today;
    }
    return profile;
  } catch {
    const profile = createDefaultProfile();
    savePlayer(profile);
    return profile;
  }
}

export function savePlayer(profile: PlayerProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function checkDailyLogin(profile: PlayerProfile, dailyLoginCoins: number): {
  profile: PlayerProfile;
  claimedCoins: number;
  newStreak: number;
} {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const alreadyClaimed = localStorage.getItem(DAILY_COINS_KEY) === today;

  if (alreadyClaimed) {
    return { profile, claimedCoins: 0, newStreak: profile.loginStreak };
  }

  let newStreak = 1;
  if (profile.lastLoginDate === yesterday) {
    newStreak = profile.loginStreak + 1;
  }

  const streakBonus = Math.floor(dailyLoginCoins * (1 + (newStreak - 1) * 0.1));
  const updatedProfile = {
    ...profile,
    coins: profile.coins + streakBonus,
    loginStreak: newStreak,
    lastLoginDate: today,
  };

  localStorage.setItem(DAILY_COINS_KEY, today);
  savePlayer(updatedProfile);
  return { profile: updatedProfile, claimedCoins: streakBonus, newStreak };
}

export function addXP(profile: PlayerProfile, amount: number): {
  profile: PlayerProfile;
  leveledUp: boolean;
  newLevel: number;
} {
  let xp = profile.xp + amount;
  let level = profile.level;
  let leveledUp = false;

  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level += 1;
    leveledUp = true;
  }

  const updated = {
    ...profile,
    xp,
    level,
    xpToNextLevel: xpForLevel(level),
    // Bonus coins for leveling up
    coins: leveledUp ? profile.coins + level * 25 : profile.coins,
  };
  return { profile: updated, leveledUp, newLevel: level };
}

export function checkAchievements(profile: PlayerProfile): {
  profile: PlayerProfile;
  newAchievements: string[];
} {
  const newAchievements: string[] = [];
  let updated = { ...profile };

  for (const ach of ACHIEVEMENTS) {
    if (updated.achievements.includes(ach.id)) continue;

    let earned = false;
    switch (ach.id) {
      case "first_word": earned = updated.stats.totalWordsSubmitted >= 1; break;
      case "word_10": earned = updated.stats.totalWordsSubmitted >= 10; break;
      case "word_100": earned = updated.stats.totalWordsSubmitted >= 100; break;
      case "word_1000": earned = updated.stats.totalWordsSubmitted >= 1000; break;
      case "score_100": earned = updated.stats.bestScore >= 100; break;
      case "score_500": earned = updated.stats.bestScore >= 500; break;
      case "streak_3": earned = updated.loginStreak >= 3; break;
      case "streak_7": earned = updated.loginStreak >= 7; break;
      case "streak_30": earned = updated.loginStreak >= 30; break;
      case "world_1": earned = (updated.worldProgress["meadow"] ?? 0) >= 5; break;
      case "long_word": earned = updated.stats.longestWord.length >= 8; break;
      case "perfect_game": earned = false; // manually triggered
    }

    if (earned) {
      newAchievements.push(ach.id);
      updated.achievements = [...updated.achievements, ach.id];
      updated.coins += ach.coinReward;
      const { profile: withXP } = addXP(updated, ach.xpReward);
      updated = withXP;
    }
  }

  return { profile: updated, newAchievements };
}

export function updateQuestProgress(
  profile: PlayerProfile,
  type: string,
  amount: number
): { profile: PlayerProfile; completedQuests: string[] } {
  const completedQuests: string[] = [];
  const updatedQuests = profile.dailyQuests.map((q) => {
    if (q.claimed || q.completed) return q;
    if (q.type !== type) return q;

    const newCurrent = Math.min(q.current + amount, q.target);
    const completed = newCurrent >= q.target;
    if (completed && !q.completed) {
      completedQuests.push(q.id);
    }
    return { ...q, current: newCurrent, completed };
  });

  return {
    profile: { ...profile, dailyQuests: updatedQuests },
    completedQuests,
  };
}

export function claimQuestReward(
  profile: PlayerProfile,
  questId: string
): PlayerProfile {
  let updated = { ...profile };
  const quest = updated.dailyQuests.find((q) => q.id === questId);
  if (!quest || !quest.completed || quest.claimed) return profile;

  updated.coins += quest.coinReward;
  const { profile: withXP } = addXP(updated, quest.xpReward);
  updated = {
    ...withXP,
    dailyQuests: withXP.dailyQuests.map((q) =>
      q.id === questId ? { ...q, claimed: true } : q
    ),
  };

  savePlayer(updated);
  return updated;
}

// ── Leaderboard (mock local data) ─────────────────────────────────────────
export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  level: number;
  badge: string;
}

export function getMockLeaderboard(): LeaderboardEntry[] {
  return [
    { rank: 1, username: "QueenBee", score: 12450, level: 42, badge: "👑" },
    { rank: 2, username: "HoneyMaster", score: 11230, level: 38, badge: "🏆" },
    { rank: 3, username: "WordWizard", score: 10890, level: 35, badge: "🥇" },
    { rank: 4, username: "BuzzKing", score: 9870, level: 31, badge: "🥈" },
    { rank: 5, username: "HiveGuard", score: 8920, level: 28, badge: "🥉" },
    { rank: 6, username: "NectarNinja", score: 7650, level: 24, badge: "⭐" },
    { rank: 7, username: "PollenPro", score: 6840, level: 20, badge: "⭐" },
    { rank: 8, username: "DroneFlyer", score: 5910, level: 17, badge: "🐝" },
    { rank: 9, username: "FloralFan", score: 4730, level: 14, badge: "🌸" },
    { rank: 10, username: "BeeNewbie", score: 3200, level: 10, badge: "🌱" },
  ];
}
