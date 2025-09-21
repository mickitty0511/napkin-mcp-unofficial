import { describe, it, expect } from "vitest";
import STYLES_CATALOG from "../../src/data/styles-catalog.js";
import { StylesCatalogZ } from "../../src/types/styles-catalog.js";

describe("styles catalog data", () => {
  it("conforms to StylesCatalogZ and totals match", () => {
    const parsed = StylesCatalogZ.parse(STYLES_CATALOG);
    const total = Object.values(parsed.built_in_styles.categories).reduce((acc, c) => acc + c.items.length, 0);
    expect(total).toBe(parsed.built_in_styles.total);
  });
});
