import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { RegenerateVisualInputZ } from "../../src/tools/regenerateVisual.js";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => { Object.assign(process.env, ORIGINAL_ENV); });
afterEach(() => { process.env = { ...ORIGINAL_ENV }; vi.resetModules(); vi.restoreAllMocks(); });

describe("RegenerateVisualInputZ", () => {
  it("requires exactly one of visual_id or visual_ids", () => {
    expect(() => RegenerateVisualInputZ.parse({ format: "svg", content: "x" } as any)).toThrow();
    expect(() => RegenerateVisualInputZ.parse({ format: "svg", content: "x", visual_id: "a", visual_ids: ["b"] } as any)).toThrow();
  });

  it("rejects visual_id with number_of_visuals > 1", () => {
    expect(() => RegenerateVisualInputZ.parse({ format: "svg", content: "x", visual_id: "a", number_of_visuals: 2 } as any)).toThrow();
  });

  it("requires visual_ids length equals number_of_visuals", () => {
    expect(() => RegenerateVisualInputZ.parse({ format: "svg", content: "x", visual_ids: ["a"], number_of_visuals: 2 } as any)).toThrow();
  });

  it("rejects width/height when format is not png", () => {
    expect(() =>
      RegenerateVisualInputZ.parse({ format: "svg", content: "x", visual_id: "id1", width: 800 } as any)
    ).toThrow();
    expect(() =>
      RegenerateVisualInputZ.parse({ format: "ppt", content: "x", visual_ids: ["id1"], number_of_visuals: 1, height: 600 } as any)
    ).toThrow();
  });
});

describe("regenerateVisual", () => {
  it("uses NAPKIN_DEFAULT_LANGUAGE when language is omitted", async () => {
    process.env.NAPKIN_DEFAULT_LANGUAGE = "en-GB";
    const { regenerateVisual: regen } = await import("../../src/tools/regenerateVisual.js");
    const client = { post: vi.fn(async () => ({ json: { id: "123e4567-e89b-12d3-a456-426614174000", status: "pending" } })) } as any;
    await regen(client, { format: "svg", content: "hello", visual_id: "VID" } as any);
    const payload = client.post.mock.calls[0][1];
    expect(payload.language).toBe("en-GB");
  });

  it("auto-selects style_id when omitted and builds statusUrl", async () => {
    vi.mock("../../src/tools/styleSelector.js", () => ({ selectStyleId: () => "STYLEX" }));
    const { regenerateVisual: regen } = await import("../../src/tools/regenerateVisual.js");
    const client = { post: vi.fn(async () => ({ json: { id: "123e4567-e89b-12d3-a456-426614174000", status: "pending" } })) } as any;
    const out = await regen(client, { format: "svg", content: "hello", visual_id: "VID" } as any);
    expect(client.post).toHaveBeenCalledWith("/v1/visual", expect.objectContaining({ style_id: "STYLEX" }));
    expect(out.statusUrl).toMatch(/\/v1\/visual\/123e4567-e89b-12d3-a456-426614174000\/status$/);
  });
});
