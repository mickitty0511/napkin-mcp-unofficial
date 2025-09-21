import { describe, it, expect } from "vitest";
import { visualQueryKeywordsByCategory, allVisualQueryKeywords } from "../../src/data/visual-query-keywords.js";

describe("visual query keywords data", () => {
  it("has no duplicates in allVisualQueryKeywords", () => {
    const set = new Set(allVisualQueryKeywords);
    expect(set.size).toBe(allVisualQueryKeywords.length);
  });
  it("each category list is non-empty", () => {
    for (const [_cat, arr] of Object.entries(visualQueryKeywordsByCategory)) {
      expect(Array.isArray(arr)).toBe(true);
      expect(arr.length).toBeGreaterThan(0);
    }
  });
});
