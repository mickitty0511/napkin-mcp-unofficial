import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NapkinHttpClient, NapkinHttpError } from "../../src/http.js";

const ORIGINAL_ENV = { ...process.env };
const originalFetch = globalThis.fetch;

function setApiKey(key = "TEST_KEY") {
  process.env.NAPKIN_API_KEY = key;
}

describe("NapkinHttpClient", () => {
  beforeEach(() => {
    Object.assign(process.env, ORIGINAL_ENV);
    setApiKey();
  });
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    if (originalFetch) globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("throws when API key is missing", async () => {
    delete process.env.NAPKIN_API_KEY;
    expect(() => new NapkinHttpClient()).toThrow(/Missing NAPKIN_API_KEY/);
  });

  it("adds Authorization and Content-Type headers", async () => {
    const seen: any[] = [];
    globalThis.fetch = vi.fn(async (url: any, init?: any) => {
      seen.push({ url, init });
      return {
        status: 200,
        async text() { return "{}"; },
      } as any;
    });
    const client = new NapkinHttpClient({ baseUrl: "https://api.example.com/" });
    await client.post("/v1/test", { a: 1 });
    expect(seen[0].init.headers.Authorization).toBe("Bearer TEST_KEY");
    expect(seen[0].init.headers["Content-Type"]).toBe("application/json");
    expect(seen[0].url).toBe("https://api.example.com/v1/test");
  });

  it("uses absolute URL when provided", async () => {
    const calls: any[] = [];
    globalThis.fetch = vi.fn(async (url: any) => {
      calls.push(url);
      return { status: 200, async text() { return "{}"; } } as any;
    });
    const client = new NapkinHttpClient({ baseUrl: "https://api.base/" });
    await client.get("https://override/path");
    expect(calls[0]).toBe("https://override/path");
  });

  it("returns {} for empty body on success", async () => {
    globalThis.fetch = vi.fn(async () => ({ status: 204, async text() { return ""; } }) as any);
    const client = new NapkinHttpClient();
    const res = await client.get("/ok");
    expect(res.status).toBe(204);
    expect(res.json).toEqual({});
  });

  it("does not retry non-retriable 4xx (400)", async () => {
    let count = 0;
    globalThis.fetch = vi.fn(async () => {
      count += 1;
      return { status: 400, async text() { return "{}"; } } as any;
    });
    const client = new NapkinHttpClient({ maxRetries: 3 });
    await expect(client.get("/bad")).rejects.toBeInstanceOf(NapkinHttpError);
    expect(count).toBe(1);
  });

  it("retries 5xx and then succeeds", async () => {
    let count = 0;
    globalThis.fetch = vi.fn(async () => {
      count += 1;
      if (count < 3) return { status: 500, async text() { return "{}"; } } as any;
      return { status: 200, async text() { return "{}"; } } as any;
    });
    // Force zero backoff
    vi.spyOn(NapkinHttpClient.prototype as any, "backoff").mockReturnValue(0);
    const client = new NapkinHttpClient({ maxRetries: 2 });
    const res = await client.get("/flaky");
    expect(count).toBe(3);
    expect(res.status).toBe(200);
  });

  it("times out and aborts", async () => {
    globalThis.fetch = vi.fn(async (_url: any, init?: any) => {
      const signal: AbortSignal | undefined = init?.signal;
      return await new Promise((_resolve, reject) => {
        const err: any = new Error("Aborted");
        err.name = "AbortError";
        signal?.addEventListener("abort", () => reject(err));
      });
    });
    const client = new NapkinHttpClient({ timeoutMs: 10, maxRetries: 0 });
    await expect(client.get("/hang" as any)).rejects.toMatchObject({ name: "AbortError" });
  });

  it("retries on JSON parse error then fails with SyntaxError when budget exhausted", async () => {
    let count = 0;
    globalThis.fetch = vi.fn(async () => {
      count += 1;
      return { status: 500, async text() { return "not json"; } } as any;
    });
    vi.spyOn(NapkinHttpClient.prototype as any, "backoff").mockReturnValue(0);
    const client = new NapkinHttpClient({ maxRetries: 1 });
    await expect(client.get("/bad-json")).rejects.toBeInstanceOf(SyntaxError);
    expect(count).toBe(2);
  });

  it("returns NapkinHttpError on 429 when maxRetries=0", async () => {
    globalThis.fetch = vi.fn(async () => ({ status: 429, async text() { return "{}"; } }) as any);
    const client = new NapkinHttpClient({ maxRetries: 0 });
    await expect(client.get("/rate")).rejects.toBeInstanceOf(NapkinHttpError);
  });
});
