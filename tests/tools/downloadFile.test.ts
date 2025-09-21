import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { buildDownloadAdvice, DownloadInputZ } from "../../src/tools/downloadFile.js";

const ORIGINAL_ENV = { ...process.env };

describe("downloadFile advisory", () => {
  beforeEach(() => { Object.assign(process.env, ORIGINAL_ENV); });
  afterEach(() => { process.env = { ...ORIGINAL_ENV }; });

  it("accepts both union shapes", () => {
    expect(() => DownloadInputZ.parse({ downloadUrl: "https://x/y" })).not.toThrow();
    const uuid = "123e4567-e89b-12d3-a456-426614174000";
    expect(() => DownloadInputZ.parse({ requestId: uuid, fileId: "f" })).not.toThrow();
  });

  it("accepts optional downloadDirectory parameter", () => {
    const uuid = "123e4567-e89b-12d3-a456-426614174000";
    expect(() => DownloadInputZ.parse({ 
      requestId: uuid, 
      fileId: "f",
      downloadDirectory: "/path/to/downloads"
    })).not.toThrow();
    
    expect(() => DownloadInputZ.parse({ 
      downloadUrl: "https://x/y",
      downloadDirectory: "/path/to/downloads"
    })).not.toThrow();
  });

  it("constructs canonical URL with base trimming and encoding", () => {
    process.env.NAPKIN_API_BASE = "https://api.example.com/";
    process.env.NAPKIN_API_KEY = "TOKEN";
    const uuid = "123e4567-e89b-12d3-a456-426614174000";
    const fileId = "file A/B";
    const out = buildDownloadAdvice({ requestId: uuid, fileId });
    expect(out.headersRequired.Authorization).toBe("Bearer TOKEN");
    expect(out.advisory).toContain("https://api.example.com/v1/visual/123e4567-e89b-12d3-a456-426614174000/file/file%20A%2FB");
    expect(out.advisory).toContain("Do not hotlink");
  });

  it("uses provided downloadDirectory", () => {
    process.env.NAPKIN_API_KEY = "TOKEN";
    const uuid = "123e4567-e89b-12d3-a456-426614174000";
    const out = buildDownloadAdvice({ 
      requestId: uuid, 
      fileId: "test",
      downloadDirectory: "/custom/path"
    });
    expect(out.downloadPath).toBe("/custom/path");
    expect(out.advisory).toContain("Download directory: /custom/path");
  });

  it("defaults to current working directory when downloadDirectory not provided", () => {
    process.env.NAPKIN_API_KEY = "TOKEN";
    const uuid = "123e4567-e89b-12d3-a456-426614174000";
    const out = buildDownloadAdvice({ requestId: uuid, fileId: "test" });
    expect(out.downloadPath).toBe(process.cwd());
    expect(out.advisory).toContain(`Download directory: ${process.cwd()}`);
  });
});
