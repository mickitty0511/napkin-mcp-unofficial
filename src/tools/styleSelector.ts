import type { StyleId } from "../types/style-id.js";
import STYLES_CATALOG from "../data/styles-catalog.js";
import type { StylesCategoryKey } from "../types/styles-catalog.js";

const PREFERRED_ITEM_NAME: Record<StylesCategoryKey, string> = {
  formal: "Subtle Accent",
  monochrome: "Minimal Contrast",
  hand_drawn: "Sketch Notes",
  casual: "Lively Layers",
  colorful: "Radiant Blocks",
};

function preferStyleIdForCategory(category: StylesCategoryKey): StyleId {
  const cat = STYLES_CATALOG.built_in_styles.categories[category];
  const preferredName = PREFERRED_ITEM_NAME[category];
  const byName = cat.items.find((i) => i.name === preferredName);
  return (byName?.id ?? cat.items[0]?.id) as StyleId;
}

// Build quick lookup of all style names and ids to allow explicit selection
const ALL_STYLE_ITEMS = Object.values(
  STYLES_CATALOG.built_in_styles.categories
).flatMap((c) => c.items);

const NAME_TO_ID = new Map<string, StyleId>(
  ALL_STYLE_ITEMS.map((i) => [i.name.toLowerCase(), i.id as StyleId])
);
const IDS = new Set<string>(ALL_STYLE_ITEMS.map((i) => i.id));

function findExplicitStyleId(text: string): StyleId | undefined {
  const t = text.toLowerCase();
  // If an exact style id string is present, honor it
  for (const id of IDS) {
    if (t.includes(id.toLowerCase())) return id as StyleId;
  }
  // If a known style name appears, honor it
  for (const [name, id] of NAME_TO_ID.entries()) {
    if (!name) continue;
    if (t.includes(name)) return id;
  }
  return undefined;
}

export function selectStyleId(
  content: string,
  opts?: { context?: string | null; language?: string }
): StyleId {
  const provided = process.env.NAPKIN_DEFAULT_STYLE_ID?.trim();
  if (provided) return provided as StyleId;

  const text = [content, opts?.context ?? ""].filter(Boolean).join("\n");
  // 1) Explicit hint from content/context wins (style name or style id)
  const explicit = findExplicitStyleId(text);
  if (explicit) return explicit;
  // 2) Otherwise, fall back to a neutral default category (formal)
  return preferStyleIdForCategory("formal");
}
