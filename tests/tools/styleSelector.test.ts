import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { selectStyleId } from "../../src/tools/styleSelector.js";
import STYLES_CATALOG from "../../src/data/styles-catalog.js";

const ORIGINAL_ENV = { ...process.env };

function findFormalSubtleAccentId(): string {
  const items = STYLES_CATALOG.built_in_styles.categories.formal.items;
  const item = items.find((i) => i.name === "Subtle Accent");
  if (!item) throw new Error("Subtle Accent not found in catalog");
  return item.id;
}

describe("selectStyleId", () => {
  beforeEach(() => { Object.assign(process.env, ORIGINAL_ENV); });
  afterEach(() => { process.env = { ...ORIGINAL_ENV }; });

  it("uses env override when set", () => {
    process.env.NAPKIN_DEFAULT_STYLE_ID = "ENV_STYLE";
    const id = selectStyleId("content");
    expect(id).toBe("ENV_STYLE");
  });

  it("picks explicit style id mentioned in text", () => {
    delete process.env.NAPKIN_DEFAULT_STYLE_ID;
    const anyId = STYLES_CATALOG.built_in_styles.categories.colorful.items[0].id;
    const id = selectStyleId(`Please use ${anyId} for this visual.`);
    expect(id).toBe(anyId);
  });

  it("picks by known style name case-insensitively", () => {
    delete process.env.NAPKIN_DEFAULT_STYLE_ID;
    const name = "Lively Layers";
    const expected = STYLES_CATALOG.built_in_styles.categories.casual.items
      .find((i) => i.name === name)!.id;
    const id = selectStyleId(`Try the ${name.toUpperCase()} style`);
    expect(id).toBe(expected);
  });

  it("falls back to formal/Subtle Accent when no hints", () => {
    delete process.env.NAPKIN_DEFAULT_STYLE_ID;
    const expected = findFormalSubtleAccentId();
    const id = selectStyleId("no hints here");
    expect(id).toBe(expected);
  });
});
