import { describe, it, expect } from "vitest";
import { INSTRUCTIONS } from "../../src/instructions.js";

describe("INSTRUCTIONS", () => {
  it("contains key sections and links", () => {
    expect(INSTRUCTIONS).toContain("[Docs]");
    expect(INSTRUCTIONS).toContain("[Usage]");
    expect(INSTRUCTIONS).toContain("[Constraints]");
    expect(INSTRUCTIONS).toContain("napkin-docs://docs/napkin-api-create-visual-request.md");
    expect(INSTRUCTIONS).toContain("visual_query");
    expect(INSTRUCTIONS).toContain("style_id");
    expect(INSTRUCTIONS).toContain("BCP 47");
  });
});
