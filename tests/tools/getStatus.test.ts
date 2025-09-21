import { describe, it, expect } from "vitest";
import { getStatus, StatusInputZ } from "../../src/tools/getStatus.js";

describe("getStatus", () => {
  it("validates input and maps response", async () => {
    const bad = { requestId: "not-a-uuid" } as any;
    expect(() => StatusInputZ.parse(bad)).toThrow();

    const client = {
      get: async () => ({ json: { id: "123e4567-e89b-12d3-a456-426614174000", status: "completed", request: {}, generated_files: [] } }),
    } as any;
    const out = await getStatus(client, { requestId: "123e4567-e89b-12d3-a456-426614174000" });
    expect(out.id).toBe("123e4567-e89b-12d3-a456-426614174000");
    expect(out.status).toBe("completed");
  });

  it("includes hint for completed status with files", async () => {
    const client = {
      get: async () => ({ 
        json: { 
          id: "123e4567-e89b-12d3-a456-426614174000", 
          status: "completed", 
          request: {}, 
          generated_files: [{ url: "https://test.com/file", visual_id: "test" }] 
        } 
      }),
    } as any;
    const out = await getStatus(client, { requestId: "123e4567-e89b-12d3-a456-426614174000" });
    expect(out._hint).toContain("Visual generation completed!");
    expect(out._hint).toContain("1 file(s) ready for download");
    expect(out._hint).toContain("napkin_download_visual_file");
  });

  it("includes hint for failed status", async () => {
    const client = {
      get: async () => ({ 
        json: { 
          id: "123e4567-e89b-12d3-a456-426614174000", 
          status: "failed", 
          request: {}, 
          generated_files: [] 
        } 
      }),
    } as any;
    const out = await getStatus(client, { requestId: "123e4567-e89b-12d3-a456-426614174000" });
    expect(out._hint).toContain("Visual generation failed");
  });

  it("includes hint for pending status", async () => {
    const client = {
      get: async () => ({ 
        json: { 
          id: "123e4567-e89b-12d3-a456-426614174000", 
          status: "pending", 
          request: {}, 
          generated_files: [] 
        } 
      }),
    } as any;
    const out = await getStatus(client, { requestId: "123e4567-e89b-12d3-a456-426614174000" });
    expect(out._hint).toContain("Visual generation in progress");
  });

  it("no hint for completed status without files", async () => {
    const client = {
      get: async () => ({ 
        json: { 
          id: "123e4567-e89b-12d3-a456-426614174000", 
          status: "completed", 
          request: {}, 
          generated_files: [] 
        } 
      }),
    } as any;
    const out = await getStatus(client, { requestId: "123e4567-e89b-12d3-a456-426614174000" });
    expect(out._hint).toBeUndefined();
  });
});
