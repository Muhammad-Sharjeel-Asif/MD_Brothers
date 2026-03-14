/**
 * Fuzzy Search Utility — v2
 *
 * Supports:
 *  • Exact matching
 *  • Prefix matching ("wo" → "wooden")
 *  • Substring matching ("tudy" → "study")
 *  • Subsequence matching ("wd" → "wood", "wdn" → "wooden")
 *  • Bigram overlap ("tabl" → "table")
 *  • Levenshtein fuzzy matching ("furnture" → "furniture")
 *  • Per-word token matching ("study" → "Wooden Study Table")
 *  • 4-tier ranking: exact > partial > fuzzy > category
 *
 * No external dependencies.
 */

export interface SearchableProduct {
  _id: string;
  title: string;
  price: number;
  description: string;
  discountPercentage: number;
  imageUrl: string;
  tags: string[];
  slug: string;
  categoryName: string;
  sku: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Low-level matchers
// ═══════════════════════════════════════════════════════════════════════════════

/** Levenshtein distance — single-row DP, O(n·m) time, O(min(n,m)) space */
function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  if (a.length < b.length) return levenshtein(b, a);

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr = new Array(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length];
}

/**
 * Is `query` a subsequence of `target`?
 * "wd" is a subsequence of "wood" (w...d)
 * "wdn" is a subsequence of "wooden" (w...d...n)
 */
function isSubsequence(query: string, target: string): boolean {
  let qi = 0;
  for (let ti = 0; ti < target.length && qi < query.length; ti++) {
    if (query[qi] === target[ti]) qi++;
  }
  return qi === query.length;
}

/**
 * Bigram overlap ratio (Dice coefficient).
 * "tabl" vs "table" → shared bigrams / total bigrams.
 */
function bigramOverlap(a: string, b: string): number {
  if (a.length < 2 || b.length < 2) return 0;

  const bigrams = (s: string) => {
    const set = new Map<string, number>();
    for (let i = 0; i < s.length - 1; i++) {
      const bi = s.slice(i, i + 2);
      set.set(bi, (set.get(bi) || 0) + 1);
    }
    return set;
  };

  const aGrams = bigrams(a);
  const bGrams = bigrams(b);
  let shared = 0;

  for (const [gram, count] of aGrams) {
    shared += Math.min(count, bGrams.get(gram) || 0);
  }

  return (2 * shared) / (a.length - 1 + (b.length - 1));
}

// ═══════════════════════════════════════════════════════════════════════════════
// Composite similarity — combines all strategies into one 0–1 score
// ═══════════════════════════════════════════════════════════════════════════════

function compositeScore(query: string, target: string): number {
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase().trim();

  if (!q || !t) return 0;

  // ── Tier 1: Exact ──────────────────────────────────────────────────────
  if (q === t) return 1.0;

  // ── Tier 2: Partial (prefix / substring / subsequence / bigram) ────────
  let partialBest = 0;

  // Target starts with query  ("wo" → "wooden")
  if (t.startsWith(q)) {
    // Score scales with how much of the target is covered
    partialBest = Math.max(partialBest, 0.85 + 0.1 * (q.length / t.length));
  }

  // Query is a substring of the target  ("tudy" → "study")
  if (t.includes(q)) {
    partialBest = Math.max(partialBest, 0.80 + 0.1 * (q.length / t.length));
  }

  // Target is a substring of the query (short field, long query)
  if (q.includes(t)) {
    partialBest = Math.max(partialBest, 0.75);
  }

  // Subsequence check  ("wd" → "wood", "wdn" → "wooden")
  if (q.length >= 2 && isSubsequence(q, t)) {
    // More characters matched = higher score
    const coverage = q.length / t.length;
    partialBest = Math.max(partialBest, 0.60 + 0.25 * coverage);
  }

  // Bigram overlap  ("tabl" → "table", "furn" → "furniture")
  if (q.length >= 2) {
    const bg = bigramOverlap(q, t);
    if (bg > 0.3) {
      partialBest = Math.max(partialBest, 0.50 + 0.40 * bg);
    }
  }

  if (partialBest > 0) return partialBest;

  // ── Tier 3: Fuzzy (Levenshtein) ────────────────────────────────────────
  const dist = levenshtein(q, t);
  const maxLen = Math.max(q.length, t.length);
  const levSim = 1 - dist / maxLen;

  // For short queries allow proportionally more edits
  const dynamicThreshold = q.length <= 3 ? 0.40 : 0.50;
  if (levSim >= dynamicThreshold) return levSim;

  // Also try Levenshtein against a prefix of the target (handles short queries against long words)
  if (q.length < t.length) {
    const prefix = t.slice(0, Math.min(q.length + 2, t.length));
    const prefixDist = levenshtein(q, prefix);
    const prefixSim = 1 - prefixDist / Math.max(q.length, prefix.length);
    if (prefixSim >= dynamicThreshold) {
      return prefixSim * 0.85; // discount slightly since it's a prefix match
    }
  }

  return 0;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Product scoring
// ═══════════════════════════════════════════════════════════════════════════════

function scoreProduct(query: string, product: SearchableProduct): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  let best = 0;

  // --- Full title match ---
  best = Math.max(best, compositeScore(q, product.title || "") * 1.0);

  // --- Per-word match (tokenised title) ---
  const titleWords = (product.title || "").split(/\s+/).filter(Boolean);
  for (const word of titleWords) {
    best = Math.max(best, compositeScore(q, word) * 0.92);
  }

  // --- SKU ---
  best = Math.max(best, compositeScore(q, product.sku || "") * 0.90);

  // --- Tags ---
  if (product.tags?.length) {
    for (const tag of product.tags) {
      best = Math.max(best, compositeScore(q, tag) * 0.80);
    }
  }

  // --- Multi-word query: score each query word against each title word ---
  const queryWords = q.split(/\s+/).filter(Boolean);
  if (queryWords.length > 1) {
    let totalWordScore = 0;
    for (const qw of queryWords) {
      let wordBest = 0;
      for (const tw of titleWords) {
        wordBest = Math.max(wordBest, compositeScore(qw, tw));
      }
      // Also check against category
      wordBest = Math.max(wordBest, compositeScore(qw, product.categoryName || "") * 0.7);
      totalWordScore += wordBest;
    }
    const avgWordScore = totalWordScore / queryWords.length;
    best = Math.max(best, avgWordScore * 0.95);
  }

  return best;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Category scoring (Priority 4 fallback)
// ═══════════════════════════════════════════════════════════════════════════════

function scoreCategory(query: string, categoryName: string): number {
  const q = query.toLowerCase().trim();
  if (!q || !categoryName) return 0;

  let best = compositeScore(q, categoryName);

  const catWords = categoryName.split(/\s+/).filter(Boolean);
  for (const word of catWords) {
    best = Math.max(best, compositeScore(q, word) * 0.95);
  }

  return best;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main search pipeline
// ═══════════════════════════════════════════════════════════════════════════════

const PRODUCT_THRESHOLD = 0.45; // Lowered for partial matching
const CATEGORY_THRESHOLD = 0.50;

export interface SearchResult {
  products: SearchableProduct[];
  matchType: "exact" | "fuzzy" | "category" | "recommended";
  matchedCategory?: string;
}

export function searchProducts(
  query: string,
  allProducts: SearchableProduct[]
): SearchResult {
  const q = query.trim();
  if (!q) return { products: [], matchType: "exact" };

  // ── Score every product ────────────────────────────────────────────────
  const scored = allProducts
    .map((p) => ({ product: p, score: scoreProduct(q, p) }))
    .filter((s) => s.score >= PRODUCT_THRESHOLD)
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0) {
    const hasExact = scored.some((s) => s.score >= 0.9);
    return {
      products: scored.map((s) => s.product),
      matchType: hasExact ? "exact" : "fuzzy",
    };
  }

  // ── Category fallback ──────────────────────────────────────────────────
  const categories = Array.from(
    new Set(allProducts.map((p) => p.categoryName).filter(Boolean))
  );

  let bestCat = "";
  let bestCatScore = 0;

  for (const cat of categories) {
    const catScore = scoreCategory(q, cat);
    if (catScore > bestCatScore) {
      bestCatScore = catScore;
      bestCat = cat;
    }
  }

  if (bestCatScore >= CATEGORY_THRESHOLD && bestCat) {
    return {
      products: allProducts.filter((p) => p.categoryName === bestCat),
      matchType: "category",
      matchedCategory: bestCat,
    };
  }

  // ── Recommended fallback ───────────────────────────────────────────────
  return {
    products: allProducts.slice(0, 8),
    matchType: "recommended",
  };
}
