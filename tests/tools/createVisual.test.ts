import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CreateVisualInputZ } from "../../src/tools/createVisual.js";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => { Object.assign(process.env, ORIGINAL_ENV); });
afterEach(() => { process.env = { ...ORIGINAL_ENV }; vi.resetModules(); vi.restoreAllMocks(); });

describe("CreateVisualInputZ", () => {
  it("enforces exclusivity visual_query vs visual_queries", () => {
    const input: any = {
      format: "svg",
      content: "x",
      visual_query: "timeline",
      visual_queries: ["flow"],
    };
    expect(() => CreateVisualInputZ.parse(input)).toThrow();
  });

  it("enforces visual_queries length equals number_of_visuals", () => {
    const input: any = {
      format: "png",
      content: "x",
      number_of_visuals: 2,
      visual_queries: ["flow"],
    };
    expect(() => CreateVisualInputZ.parse(input)).toThrow();
  });

  it("rejects width/height when format is not png", () => {
    expect(() =>
      CreateVisualInputZ.parse({ format: "svg", content: "x", width: 800 } as any)
    ).toThrow();
    expect(() =>
      CreateVisualInputZ.parse({ format: "ppt", content: "x", height: 600 } as any)
    ).toThrow();
  });
});

describe("createVisual", () => {
  it("auto-selects style_id when omitted and builds statusUrl from env base", async () => {
    process.env.NAPKIN_API_BASE = "https://api.example.com/";
    // Mock selectStyleId to a stable value
    vi.mock("../../src/tools/styleSelector.js", () => ({ selectStyleId: () => "SELECTED_STYLE" }));
    const { createVisual: create } = await import("../../src/tools/createVisual.js");
    const client = { post: vi.fn(async () => ({ json: { id: "123e4567-e89b-12d3-a456-426614174000", status: "pending", request: {}, generated_files: [] } })) } as any;
    const out = await create(client, { format: "svg", content: "hi" } as any);
    expect(client.post).toHaveBeenCalledWith("/v1/visual", expect.objectContaining({ style_id: "SELECTED_STYLE" }));
    // Note: base includes trailing slash, implementation concatenates with "/v1/..." resulting in double slash
    expect(out.statusUrl).toBe("https://api.example.com//v1/visual/123e4567-e89b-12d3-a456-426614174000/status");
  });

  it("trims provided style_id and uses default base when env missing", async () => {
    delete process.env.NAPKIN_API_BASE;
    const { createVisual: create } = await import("../../src/tools/createVisual.js");
    const client = { post: vi.fn(async () => ({ json: { id: "123e4567-e89b-12d3-a456-426614174000", status: "completed" } })) } as any;
    const out = await create(client, { format: "svg", content: "hi", style_id: "  ABC  " } as any);
    expect(client.post).toHaveBeenCalledWith("/v1/visual", expect.objectContaining({ style_id: "ABC" }));
    expect(out.statusUrl).toBe("https://api.napkin.ai/v1/visual/123e4567-e89b-12d3-a456-426614174000/status");
  });
});
