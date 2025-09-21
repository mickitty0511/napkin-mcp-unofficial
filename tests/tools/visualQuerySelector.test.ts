import { describe, it, expect } from "vitest";
import { inferVisualQueries, inferVisualQueriesFromText } from "../../src/tools/visualQuerySelector.js";

describe("visualQuerySelector", () => {
  it("finds single category and returns first keyword", () => {
    const res = inferVisualQueriesFromText("This is a timeline with milestone");
    expect(res).toEqual(["timeline"]);
  });

  it("orders by score then category name when equal", () => {
    const text = "We need a timeline and a flowchart";
    const res = inferVisualQueriesFromText(text, { count: 2 });
    // Matches flow/process (score 2) and timeline/roadmap & chart/graph (score 1 each).
    // Second pick prefers chart/graph ("bar chart") by category name tiebreak.
    expect(res).toEqual(["flow", "bar chart"]);
  });

  it("dedupes results and respects count", () => {
    const res = inferVisualQueriesFromText("timeline timeline cards", { count: 2 });
    // unique items, not exceeding count
    expect(new Set(res).size).toBe(res.length);
    expect(res.length).toBeLessThanOrEqual(2);
    expect(res).toContain("timeline");
  });

  it("combines content and context", () => {
    const res = inferVisualQueries("content only", "add a venn diagram", { count: 1 });
    expect(res).toEqual(["venn"]);
  });

  it("returns empty array when no matches", () => {
    expect(inferVisualQueriesFromText("no matches here")).toEqual([]);
  });
});
