import { LETTER_VALUES, BOARD_BONUSES, type BonusType } from "./constants";

// ── Tile & Board Types ────────────────────────────────────────────────────
export interface Tile {
  id: string;
  letter: string;
  value: number;
}

export interface PlacedTile {
  tile: Tile;
  row: number;
  col: number;
}

export interface BoardState {
  cells: (Tile | null)[][];
}

// ── Score Calculation ─────────────────────────────────────────────────────
export function calculateWordScore(
  placedTiles: PlacedTile[],
  board: BoardState
): { score: number; breakdown: string[] } {
  let letterSum = 0;
  let wordMultiplier = 1;
  const breakdown: string[] = [];

  for (const { tile, row, col } of placedTiles) {
    const bonus: BonusType = BOARD_BONUSES[row][col];
    let letterScore = tile.value;

    if (bonus === "DL") {
      letterScore *= 2;
      breakdown.push(`${tile.letter}×2`);
    } else if (bonus === "TL") {
      letterScore *= 3;
      breakdown.push(`${tile.letter}×3`);
    } else if (bonus === "HP") {
      letterScore *= 3;
      breakdown.push(`${tile.letter}×3(🍯)`);
    } else {
      breakdown.push(tile.letter);
    }

    if (bonus === "DW" || bonus === "CENTER") wordMultiplier *= 2;
    if (bonus === "TW") wordMultiplier *= 3;

    letterSum += letterScore;
  }

  // Length bonus
  const wordLength = placedTiles.length;
  const lengthBonus = wordLength >= 7 ? 50 : wordLength >= 5 ? 20 : wordLength >= 4 ? 5 : 0;

  const score = letterSum * wordMultiplier + lengthBonus;

  if (wordMultiplier > 1) breakdown.push(`×${wordMultiplier} word`);
  if (lengthBonus > 0) breakdown.push(`+${lengthBonus} length bonus`);

  return { score, breakdown };
}

// ── Tile Rack Generation ──────────────────────────────────────────────────
const ALL_LETTERS = "AABBCCDDEEEEEEEEFFGGHHIIIIIIJKLLLLMMNNNNOOOOOOOOPPQRRRRRSSSSTTTTTUUUUVVWWXYYZ";

export function generateTileRack(count: number = 7): Tile[] {
  const pool = ALL_LETTERS.split("");
  const tiles: Tile[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const letter = pool[idx];
    tiles.push({
      id: `tile_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 5)}`,
      letter,
      value: LETTER_VALUES[letter] ?? 1,
    });
  }
  return tiles;
}

export function shuffleTiles(tiles: Tile[]): Tile[] {
  return [...tiles].sort(() => Math.random() - 0.5);
}

// ── Dictionary Validation ─────────────────────────────────────────────────
// Using a simple word list check + Free Dictionary API
const validatedCache = new Map<string, boolean>();

// Common English words for offline validation
const COMMON_WORDS = new Set([
  "a","be","bee","best","big","bug","but","by","can","do","eat","far","fee","few","fly","for","fun","get","got","had","has","him","his","hit","hop","hot","how","hug","ice","its","jay","job","joy","key","kid","kit","log","lot","low","mad","map","met","mix","mob","mom","mud","nap","net","new","not","now","oak","odd","off","oil","old","one","our","out","own","pay","pen","pet","pie","pin","pit","ply","pod","pot","pox","pro","pub","pun","put","raw","ray","red","ref","rep","rev","rid","rip","rob","rod","rot","row","rub","rug","run","rye","sad","sat","saw","say","sea","set","sew","six","ski","sky","sly","sob","sol","son","sop","spa","spy","sty","sub","sue","sum","sup","tab","tan","tap","tar","tax","tea","ten","the","tie","tip","toe","too","top","toy","tub","tug","two","use","van","vat","via","vie","vim","vow","way","web","wed","wet","who","why","wig","win","wit","woe","wok","won","woo","wow","yak","yam","yap","yaw","yep","yet","yew","you","zap","zed","zen","zip","zoo",
  "able","acid","aged","also","area","army","away","baby","back","ball","band","bank","base","bath","bear","beat","been","bell","belt","best","bird","blow","blue","body","bold","bold","bone","book","boom","bore","born","both","bowl","brow","bulk","bull","burn","bush","calm","came","card","care","case","cash","cast","cave","cell","chat","chin","chip","city","clap","clay","clip","club","coal","coat","code","coin","cold","come","cook","cope","copy","core","corn","cost","coup","crew","crop","cure","curl","dare","dark","dash","data","date","dawn","days","dead","deal","dear","deep","deny","desk","diet","dirt","dish","disk","dock","does","dome","done","door","dose","dove","down","drab","drag","draw","drew","drop","drug","drum","dual","duel","dull","dumb","dump","dusk","dust","duty","each","earn","ease","east","edge","else","emit","epic","even","ever","exam","exit","face","fact","fail","fair","fall","fame","farm","fast","fate","feel","feet","fell","felt","file","fill","film","find","fine","fire","firm","fish","fist","five","flag","flaw","flea","flew","flex","flow","foam","fold","folk","fond","font","food","fool","fore","fork","form","fort","foul","four","free","from","fuel","full","fund","fury","fuse","gain","gale","game","gang","gate","gave","gear","gene","give","glad","glee","glow","glue","goal","goes","gold","golf","good","gore","gown","grab","gram","grew","grid","grim","grip","grit","grow","gulf","guru","gush","gust","hack","half","hall","halo","hand","hang","hard","hare","harm","harp","hash","hate","have","hawk","head","heal","heap","heat","heel","held","help","herb","here","hero","hide","high","hill","hold","hole","home","hone","hood","hook","hoop","hope","horn","hose","host","hour","hull","hump","hunt","hurt","hymn","idea","idle","idol","inch","into","iron","isle","item","jack","jade","jail","jibe","jilt","join","joke","jolt","jump","junk","just","keen","keep","keel","kick","kind","king","kiss","knee","knew","knot","know","lace","lack","laid","lame","lane","lark","lash","laud","lawn","lead","leaf","leak","lean","leap","lend","lens","lest","lick","life","lift","like","lime","line","link","lion","lips","list","live","load","loft","lone","long","look","loop","lore","lose","loss","lost","loud","love","lull","lurk","lush","lust","lute","lynx","made","mail","main","make","male","mall","mane","many","mark","mask","mast","mate","math","maze","meal","mean","meat","melt","memo","mice","mild","milk","mill","mime","mind","mine","mint","miss","mist","mode","mole","molt","monk","mood","moon","more","moss","most","move","mule","muse","must","myth","nail","name","near","neck","need","nest","next","nice","nine","node","none","nook","norm","nose","note","noun","nude","numb","obey","omen","once","open","oral","orca","orb","pace","pack","page","pale","palm","pane","pave","pawn","peak","peel","peer","pick","pile","pill","pine","pink","pipe","plan","play","plea","plop","plow","plug","plus","poem","poet","pole","pond","pore","pork","pose","post","pour","pray","prey","prop","pull","pump","pure","push","quit","quiz","race","rack","rage","rain","rake","ramp","rang","rank","rare","rash","rate","rave","read","real","reap","rear","rely","rend","rent","rest","rice","rich","ride","ring","rise","risk","roar","robe","rock","role","roll","roof","room","rope","rose","rule","rush","rust","ruth","safe","sage","sail","sale","salt","same","sand","sane","sang","sash","save","scan","scar","seam","seat","seed","seek","seem","seen","self","sell","send","sent","shed","shin","ship","shoe","shop","shot","show","shut","sick","side","sigh","silk","sill","sing","sink","site","size","skip","slam","slap","sled","slim","slop","slot","slow","slug","slum","soak","soar","sock","soil","sold","sole","some","song","soot","sore","sort","soul","soup","sour","span","spar","spec","sped","spin","spit","spot","spur","stab","star","stem","step","stew","stir","stop","strap","stub","stun","suck","sunk","surf","swan","swat","sway","swim","tail","tale","tall","tame","taut","tear","teen","tell","term","test","than","that","them","then","they","thin","this","thou","thud","tick","tide","till","time","tiny","tire","toad","toil","told","toll","tomb","tone","tong","toot","tore","torn","toss","tote","tour","town","tram","trap","trim","trio","trip","trod","trot","true","tune","turf","twig","twin","type","ugly","undo","unit","upon","urge","used","user","vale","vary","vast","vein","very","vice","view","vine","void","volt","vote","wade","wage","wake","walk","wall","wane","warp","wart","wary","wash","wasp","wave","weak","weal","wean","wear","weed","week","well","welt","wend","went","were","west","what","when","whim","whip","wide","wife","wild","will","wind","wine","wing","wink","wire","wise","wish","with","wolf","wood","wool","word","wore","work","worm","wren","yard","yarn","year","yell","your","zero","zone","zoom",
  "honey","buzz","hive","wing","sting","petal","bloom","flower","queen","drone","swarm","nectar","pollen","colony","comb","royal","stinger","antler",
  "about","above","abuse","actor","acute","admit","adopt","adult","after","again","agent","agree","ahead","alarm","album","alert","alien","align","alike","allot","allow","alone","aloof","alter","amber","ample","angle","angry","annex","annoy","apart","apply","arena","argue","arise","armor","aroma","arose","array","arson","aside","asked","atlas","attic","audit","avail","avoid","awake","award","aware","awful","badly","badge","bagel","basic","basil","basin","basis","batch","bayou","beach","began","begin","being","below","bench","berry","bingo","birth","bison","black","blade","blame","blank","blast","blaze","bleed","bless","blind","block","blood","blown","blunt","board","bogus","bonus","boost","booth","boxer","brace","braid","brain","brake","brand","brave","bread","break","breed","brick","bride","brief","brine","bring","brink","brine","bring","brink","brisk","broil","broke","brook","broth","brown","bruce","brush","brute","bunny","buyer","cabin","cable","camel","cameo","carol","carve","catch","cause","cedar","chair","chalk","charm","chart","chase","cheer","chess","chest","chief","child","choir","chomp","chore","civic","civil","claim","class","clean","clear","click","climb","cling","clone","close","cloud","coach","cobra","comet","comic","comma","coral","could","count","court","cover","craft","crane","crawl","craze","crazy","cream","creek","crest","crimp","crook","cross","crowd","crown","cruel","crush","crust","cycle",
]);

export async function validateWord(word: string): Promise<boolean> {
  const lower = word.toLowerCase();
  if (lower.length < 2) return false;

  // Check cache
  if (validatedCache.has(lower)) return validatedCache.get(lower)!;

  // Check common words list
  if (COMMON_WORDS.has(lower)) {
    validatedCache.set(lower, true);
    return true;
  }

  // Try Dictionary API for unknown words
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(lower)}`,
      { signal: AbortSignal.timeout(3000) }
    );
    const isValid = response.ok;
    validatedCache.set(lower, isValid);
    return isValid;
  } catch {
    // If API fails, accept words 3+ letters that look valid
    validatedCache.set(lower, lower.length >= 3);
    return lower.length >= 3;
  }
}

// ── Board Placement Validation ────────────────────────────────────────────
export function extractWordFromPlacements(
  placements: PlacedTile[],
  board: BoardState
): { word: string; allTiles: PlacedTile[] } | null {
  if (placements.length === 0) return null;

  // Check all tiles are in the same row or column
  const rows = placements.map((p) => p.row);
  const cols = placements.map((p) => p.col);
  const allSameRow = new Set(rows).size === 1;
  const allSameCol = new Set(cols).size === 1;

  if (!allSameRow && !allSameCol) return null;

  if (allSameRow) {
    const row = rows[0];
    const colRange = [Math.min(...cols), Math.max(...cols)];
    const allTiles: PlacedTile[] = [];

    for (let c = colRange[0]; c <= colRange[1]; c++) {
      const placed = placements.find((p) => p.col === c);
      if (placed) {
        allTiles.push(placed);
      } else if (board.cells[row][c]) {
        allTiles.push({ tile: board.cells[row][c]!, row, col: c });
      } else {
        return null; // gap in word
      }
    }
    const word = allTiles.map((t) => t.tile.letter).join("");
    return { word, allTiles };
  } else {
    const col = cols[0];
    const rowRange = [Math.min(...rows), Math.max(...rows)];
    const allTiles: PlacedTile[] = [];

    for (let r = rowRange[0]; r <= rowRange[1]; r++) {
      const placed = placements.find((p) => p.row === r);
      if (placed) {
        allTiles.push(placed);
      } else if (board.cells[r][col]) {
        allTiles.push({ tile: board.cells[r][col]!, row: r, col });
      } else {
        return null;
      }
    }
    const word = allTiles.map((t) => t.tile.letter).join("");
    return { word, allTiles };
  }
}
