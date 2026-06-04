import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, Link } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import {
  BOARD_BONUSES,
  POWER_UPS,
  type BonusType,
  type GameMode,
} from "~/game/constants";
import {
  generateTileRack,
  shuffleTiles,
  validateWord,
  calculateWordScore,
  extractWordFromPlacements,
  type Tile,
  type PlacedTile,
  type BoardState,
} from "~/game/game-engine";
import {
  loadPlayer,
  savePlayer,
  addXP,
  checkAchievements,
  updateQuestProgress,
  type PlayerProfile,
} from "~/game/player-store";
import { cn } from "~/lib/utils";

// ── Bonus Cell Label ───────────────────────────────────────────────────────
function bonusLabel(bonus: BonusType): string {
  switch (bonus) {
    case "DW": return "DW";
    case "TW": return "TW";
    case "DL": return "DL";
    case "TL": return "TL";
    case "HP": return "🍯";
    case "CENTER": return "★";
    default: return "";
  }
}

function bonusCellClass(bonus: BonusType): string {
  switch (bonus) {
    case "DW": return "bonus-dw";
    case "TW": return "bonus-tw";
    case "DL": return "bonus-dl";
    case "TL": return "bonus-tl";
    case "HP": return "bonus-hp";
    case "CENTER": return "center";
    default: return "";
  }
}

// ── Letter Tile Component ─────────────────────────────────────────────────
function LetterTileComponent({
  tile,
  onSelect,
  selected,
  placed,
  disabled,
}: {
  tile: Tile;
  onSelect: () => void;
  selected?: boolean;
  placed?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={disabled ? undefined : onSelect}
      disabled={disabled}
      className={cn(
        "letter-tile w-12 h-12 md:w-14 md:h-14 flex items-center justify-center font-fredoka",
        selected && "selected",
        placed && "placed opacity-60",
        disabled && "opacity-40 cursor-not-allowed"
      )}
      aria-label={`Letter ${tile.letter}, value ${tile.value}`}
    >
      <span className="text-xl">{tile.letter}</span>
      <span className="point-value">{tile.value}</span>
    </button>
  );
}

// ── Score Toast ────────────────────────────────────────────────────────────
function ScoreToast({ score, word, onDone }: { score: number; word: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-pop-in">
      <div
        className="px-6 py-3 rounded-2xl shadow-2xl text-center"
        style={{ background: "linear-gradient(135deg, #F5C518, #FF8C00)", border: "3px solid #3D2B1F" }}
      >
        <div className="font-fredoka text-[#3D2B1F] text-2xl">{word}!</div>
        <div className="font-bebas text-[#3D2B1F] text-xl">+{score} pts 🍯</div>
      </div>
    </div>
  );
}

// ── Game Over Modal ────────────────────────────────────────────────────────
function GameOverModal({
  score,
  wordsFound,
  mode,
  coinsEarned,
  onPlayAgain,
  onHome,
}: {
  score: number;
  wordsFound: number;
  mode: GameMode;
  coinsEarned: number;
  onPlayAgain: () => void;
  onHome: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="game-card mx-4 w-full max-w-sm p-6 text-center animate-pop-in" style={{ border: "3px solid #F5C518" }}>
        <div className="text-5xl mb-2">🏆</div>
        <h2 className="font-fredoka text-2xl text-[#3D2B1F] mb-1">Game Over!</h2>
        <p className="text-[#8B6A3E] text-sm mb-4 font-nunito capitalize">{mode} Mode</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#FFF8E7] rounded-xl p-3 border border-[#E8C87A]/40">
            <div className="font-bebas text-2xl text-[#3D2B1F]">{score}</div>
            <div className="text-[#8B6A3E] text-xs font-nunito">Total Score</div>
          </div>
          <div className="bg-[#FFF8E7] rounded-xl p-3 border border-[#E8C87A]/40">
            <div className="font-bebas text-2xl text-[#3D2B1F]">{wordsFound}</div>
            <div className="text-[#8B6A3E] text-xs font-nunito">Words Found</div>
          </div>
        </div>

        {coinsEarned > 0 && (
          <div className="flex items-center justify-center gap-2 mb-4 bg-gradient-to-r from-[#F5C518]/20 to-[#FF8C00]/20 rounded-xl p-3 border border-[#F5C518]/30">
            <span className="text-xl">🪙</span>
            <span className="font-bebas text-[#3D2B1F] text-xl">+{coinsEarned} Coins Earned!</span>
          </div>
        )}

        <div className="space-y-2">
          <button onClick={onPlayAgain} className="btn-primary w-full py-3 font-fredoka text-lg">
            Play Again! 🐝
          </button>
          <button onClick={onHome} className="w-full py-3 text-[#8B6A3E] font-nunito font-semibold text-sm hover:text-[#3D2B1F] transition-colors">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Game Board ────────────────────────────────────────────────────────
export default function GamePage() {
  const [searchParams] = useSearchParams();
  const { config } = useConfigurables();
  const mode = (searchParams.get("mode") ?? "endless") as GameMode;

  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [rack, setRack] = useState<Tile[]>([]);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [placements, setPlacements] = useState<PlacedTile[]>([]);
  const [board, setBoard] = useState<BoardState>({ cells: Array.from({ length: 15 }, () => Array(15).fill(null)) });
  const [score, setScore] = useState(0);
  const [wordsFound, setWordsFound] = useState<string[]>([]);
  const [validating, setValidating] = useState(false);
  const [scoreToast, setScoreToast] = useState<{ score: number; word: string } | null>(null);
  const [shakeMode, setShakeMode] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(mode === "timed" ? 120 : null);
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null);
  const [doubleScoreActive, setDoubleScoreActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const p = loadPlayer();
    setPlayer(p);
    setRack(generateTileRack(7));
  }, []);

  // Timer for timed mode
  useEffect(() => {
    if (mode !== "timed" || gameOver) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t === null || t <= 0) {
          clearInterval(timerRef.current!);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, gameOver]);

  const handleCellClick = (row: number, col: number) => {
    if (!selectedTile || gameOver) return;
    if (board.cells[row][col]) return; // cell occupied

    const placement: PlacedTile = { tile: selectedTile, row, col };
    setPlacements((prev) => [...prev, placement]);
    setRack((prev) => prev.filter((t) => t.id !== selectedTile.id));
    setSelectedTile(null);
  };

  const handleRemovePlacement = (row: number, col: number) => {
    const placement = placements.find((p) => p.row === row && p.col === col);
    if (!placement) return;
    setPlacements((prev) => prev.filter((p) => !(p.row === row && p.col === col)));
    setRack((prev) => [...prev, placement.tile]);
  };

  const handleSubmitWord = useCallback(async () => {
    if (placements.length < 2 || validating || gameOver) return;

    const extracted = extractWordFromPlacements(placements, board);
    if (!extracted) {
      setShakeMode(true);
      setTimeout(() => setShakeMode(false), 500);
      return;
    }

    setValidating(true);
    const isValid = await validateWord(extracted.word);
    setValidating(false);

    if (!isValid) {
      setShakeMode(true);
      setTimeout(() => setShakeMode(false), 500);
      return;
    }

    // Apply to board
    const newCells = board.cells.map((row) => [...row]);
    for (const { tile, row, col } of placements) {
      newCells[row][col] = tile;
    }

    let { score: wordScore } = calculateWordScore(placements, board);
    if (doubleScoreActive) {
      wordScore *= 2;
      setDoubleScoreActive(false);
    }

    setBoard({ cells: newCells });
    setPlacements([]);
    setScore((s) => s + wordScore);
    setWordsFound((w) => [...w, extracted.word]);

    // Refill rack
    const tilesNeeded = 7 - (rack.length);
    if (tilesNeeded > 0) {
      setRack((prev) => [...prev, ...generateTileRack(tilesNeeded)]);
    }

    setScoreToast({ score: wordScore, word: extracted.word });

    // Update player stats
    if (player) {
      let updated = {
        ...player,
        stats: {
          ...player.stats,
          totalWordsSubmitted: player.stats.totalWordsSubmitted + 1,
          totalScore: player.stats.totalScore + wordScore,
          longestWord: extracted.word.length > player.stats.longestWord.length
            ? extracted.word
            : player.stats.longestWord,
          highestWordScore: Math.max(player.stats.highestWordScore, wordScore),
        },
      };
      const { profile: withXP } = addXP(updated, Math.floor(wordScore / 5));
      updated = withXP;

      // Update quest progress
      const { profile: withQuest } = updateQuestProgress(updated, "words", 1);
      updated = withQuest;
      const { profile: withScoreQuest } = updateQuestProgress(updated, "score", wordScore);
      updated = withScoreQuest;

      const { profile: withAch } = checkAchievements(updated);
      updated = withAch;
      savePlayer(updated);
      setPlayer(updated);
    }

    // Daily mode ends after 5 words
    if (mode === "daily" && wordsFound.length + 1 >= 5) {
      setTimeout(() => setGameOver(true), 1000);
    }
  }, [placements, board, player, validating, gameOver, rack, wordsFound, doubleScoreActive, mode]);

  const handleClearPlacements = () => {
    setRack((prev) => [...prev, ...placements.map((p) => p.tile)]);
    setPlacements([]);
    setSelectedTile(null);
  };

  const handleUsePowerUp = (powerUpId: string) => {
    if (!player) return;
    const qty = player.inventory.powerups[powerUpId] ?? 0;
    if (qty <= 0) return;

    const updated = {
      ...player,
      inventory: {
        ...player.inventory,
        powerups: { ...player.inventory.powerups, [powerUpId]: qty - 1 },
      },
    };

    switch (powerUpId) {
      case "shuffle":
        setRack(shuffleTiles(rack));
        break;
      case "double":
        setDoubleScoreActive(true);
        break;
      case "time_ext":
        if (mode === "timed") setTimeLeft((t) => (t ?? 0) + 30);
        break;
      default:
        break;
    }

    savePlayer(updated);
    setPlayer(updated);
  };

  const handlePlayAgain = () => {
    setBoard({ cells: Array.from({ length: 15 }, () => Array(15).fill(null)) });
    setScore(0);
    setWordsFound([]);
    setPlacements([]);
    setRack(generateTileRack(7));
    setGameOver(false);
    if (mode === "timed") setTimeLeft(120);
  };

  const handleGameEnd = () => {
    if (!player || gameOver) return;
    const coinsEarned = Math.floor(score / 10) + wordsFound.length * 5;
    const updated = {
      ...player,
      coins: player.coins + coinsEarned,
      stats: {
        ...player.stats,
        gamesPlayed: player.stats.gamesPlayed + 1,
        bestScore: Math.max(player.stats.bestScore, score),
      },
    };
    const { profile: withXP } = addXP(updated, Math.floor(score / 10));
    const { profile: withAch } = checkAchievements(withXP);
    savePlayer(withAch);
    setPlayer(withAch);
    setGameOver(true);
  };

  const coinsEarned = Math.floor(score / 10) + wordsFound.length * 5;
  const modeColors: Record<GameMode, string> = {
    adventure: "#4CAF50",
    daily: "#64B5F6",
    timed: "#FF8C00",
    endless: "#9C27B0",
    practice: "#4CAF50",
  };
  const modeColor = modeColors[mode];

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex flex-col">
      {/* Game Header */}
      <header className="bg-[#3D2B1F] shadow-md">
        <div className="flex items-center justify-between px-4 py-2">
          <Link to="/" className="text-[#F5C518] font-fredoka text-lg">← Back</Link>
          <div className="text-center">
            <div className="font-fredoka text-[#F5C518] text-base capitalize">{mode} Mode</div>
            {mode === "timed" && timeLeft !== null && (
              <div className={cn("font-bebas text-xl", timeLeft < 30 ? "text-[#FF5252]" : "text-white")}>
                ⏱ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="font-bebas text-white text-xl">{score}</div>
            <div className="text-[#C8A96E] text-xs font-nunito">Score</div>
          </div>
        </div>

        {/* Quest objectives */}
        {player && player.dailyQuests.some((q) => !q.completed) && (
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
            {player.dailyQuests.filter((q) => !q.completed).map((q) => (
              <div key={q.id} className="flex-shrink-0 flex items-center gap-1 bg-[rgba(255,255,255,0.1)] px-2 py-1 rounded-full">
                <span className="text-xs">{q.emoji}</span>
                <span className="text-[#C8A96E] text-xs font-nunito whitespace-nowrap">{q.title}: {q.current}/{q.target}</span>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Score Toast */}
      {scoreToast && (
        <ScoreToast
          score={scoreToast.score}
          word={scoreToast.word}
          onDone={() => setScoreToast(null)}
        />
      )}

      {/* Words Found */}
      {wordsFound.length > 0 && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto bg-white/60 backdrop-blur-sm border-b border-[#E8C87A]/40">
          {wordsFound.map((w, i) => (
            <span
              key={i}
              className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-nunito font-semibold"
              style={{ background: modeColor + "20", color: modeColor, border: `1px solid ${modeColor}40` }}
            >
              {w}
            </span>
          ))}
        </div>
      )}

      {/* Double Score Banner */}
      {doubleScoreActive && (
        <div className="bg-gradient-to-r from-[#FF5252] to-[#FF8C00] py-1 text-center">
          <span className="text-white font-fredoka text-sm">⚡ Double Score Active!</span>
        </div>
      )}

      {/* Game Board */}
      <div className="flex-1 overflow-auto p-2">
        <div className="flex justify-center">
          <div
            className={cn("game-board inline-block", shakeMode && "animate-tile-shake")}
            style={{ touchAction: "none" }}
          >
            {Array.from({ length: 15 }, (_, row) => (
              <div key={row} className="flex">
                {Array.from({ length: 15 }, (_, col) => {
                  const bonus = BOARD_BONUSES[row][col];
                  const boardTile = board.cells[row][col];
                  const placement = placements.find((p) => p.row === row && p.col === col);
                  const isPlaced = !!placement;
                  const cellSize = "w-8 h-8 md:w-10 md:h-10";

                  return (
                    <div
                      key={col}
                      onClick={() => {
                        if (isPlaced) handleRemovePlacement(row, col);
                        else handleCellClick(row, col);
                      }}
                      className={cn(
                        "board-cell cursor-pointer select-none",
                        cellSize,
                        bonusCellClass(bonus),
                        selectedTile && !boardTile && !isPlaced && "hover:opacity-80 hover:ring-2 hover:ring-[#F5C518]",
                        isPlaced && "ring-2 ring-[#FF8C00]"
                      )}
                    >
                      {boardTile && !isPlaced ? (
                        <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-br from-[#F7E87C] to-[#E8C84A] rounded-sm">
                          <span className="font-fredoka text-[#3D2B1F] text-sm font-bold">{boardTile.letter}</span>
                          <span className="absolute bottom-0 right-0.5 text-[7px] font-bebas text-[#8B6A3E]">{boardTile.value}</span>
                        </div>
                      ) : isPlaced ? (
                        <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-br from-[#FFE066] to-[#F5C518] rounded-sm animate-tile-bounce ring-2 ring-[#FF8C00]">
                          <span className="font-fredoka text-[#3D2B1F] text-sm font-bold">{placement.tile.letter}</span>
                          <span className="absolute bottom-0 right-0.5 text-[7px] font-bebas text-[#8B6A3E]">{placement.tile.value}</span>
                        </div>
                      ) : (
                        <span className="text-[9px] font-bebas text-center leading-tight opacity-70 px-0.5">
                          {bonusLabel(bonus)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Controls Bottom Section */}
      <div className="bg-[#3D2B1F] border-t-2 border-[#F5C518]/30 pb-4">
        {/* Tile Rack */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {rack.map((tile) => (
              <LetterTileComponent
                key={tile.id}
                tile={tile}
                onSelect={() => setSelectedTile(selectedTile?.id === tile.id ? null : tile)}
                selected={selectedTile?.id === tile.id}
                disabled={gameOver}
              />
            ))}
            {rack.length === 0 && (
              <div className="text-[#C8A96E] text-sm font-nunito italic py-4">No tiles — submitting to refill...</div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 flex gap-2">
          <button
            onClick={handleClearPlacements}
            disabled={placements.length === 0 || gameOver}
            className="flex-1 py-2.5 rounded-2xl font-nunito font-semibold text-sm border-2 border-[rgba(255,255,255,0.2)] text-[#C8A96E] disabled:opacity-40"
          >
            Clear ✕
          </button>
          <button
            onClick={handleSubmitWord}
            disabled={placements.length < 2 || validating || gameOver}
            className={cn(
              "flex-[2] py-2.5 rounded-2xl font-fredoka text-lg transition-all",
              "bg-gradient-to-r from-[#F5C518] to-[#FF8C00] text-[#3D2B1F]",
              "border-b-4 border-[#C87000]",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "active:border-b-0 active:mt-1"
            )}
          >
            {validating ? "Checking..." : "Submit Word! 🐝"}
          </button>
          <button
            onClick={handleGameEnd}
            disabled={gameOver}
            className="flex-1 py-2.5 rounded-2xl font-nunito font-semibold text-sm border-2 border-[rgba(255,255,255,0.2)] text-[#C8A96E] disabled:opacity-40"
          >
            End 🏁
          </button>
        </div>

        {/* Power-ups */}
        {player && (
          <div className="px-4 mt-2 flex gap-2 overflow-x-auto pb-1">
            {POWER_UPS.map((pu) => {
              const qty = player.inventory.powerups[pu.id] ?? 0;
              return (
                <button
                  key={pu.id}
                  onClick={() => handleUsePowerUp(pu.id)}
                  disabled={qty === 0 || gameOver}
                  title={pu.description}
                  className={cn(
                    "flex-shrink-0 flex flex-col items-center px-3 py-1.5 rounded-xl text-xs font-nunito",
                    "border transition-all",
                    qty > 0 && !gameOver
                      ? "border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.1)] active:scale-95"
                      : "border-[rgba(255,255,255,0.1)] text-[#8B6A3E] opacity-50"
                  )}
                >
                  <span className="text-lg">{pu.emoji}</span>
                  <span>{qty}x</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <GameOverModal
          score={score}
          wordsFound={wordsFound.length}
          mode={mode}
          coinsEarned={coinsEarned}
          onPlayAgain={handlePlayAgain}
          onHome={() => window.location.href = "/"}
        />
      )}
    </div>
  );
}
