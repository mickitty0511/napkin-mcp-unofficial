import { visualQueryKeywordsByCategory } from "../data/visual-query-keywords.js";

export type InferOptions = {
  count?: number; // default 1
};

function textIncludes(haystack: string, needle: string): boolean {
  if (!needle) return false;
  return haystack.includes(needle.toLowerCase());
}

export function inferVisualQueriesFromText(
  text: string,
  opts?: InferOptions
): string[] {
  const count = Math.max(1, opts?.count ?? 1);
  const s = (text || "").toLowerCase();
  const scored: Array<{ cat: string; score: number; firstKeyword: string }> = [];
  for (const [cat, keywords] of Object.entries(visualQueryKeywordsByCategory)) {
    let score = 0;
    for (const kw of keywords) {
      if (textIncludes(s, kw)) score += 1;
    }
    if (score > 0) scored.push({ cat, score, firstKeyword: keywords[0] ?? cat });
  }
  scored.sort((a, b) => b.score - a.score || a.cat.localeCompare(b.cat));
  const picks = scored.slice(0, count).map((r) => r.firstKeyword);
  return Array.from(new Set(picks));
}

export function inferVisualQueries(
  content: string,
  context?: string | null,
  opts?: InferOptions
): string[] {
  const combined = [context ?? "", content ?? ""].join("\n\n");
  return inferVisualQueriesFromText(combined, opts);
}
