import { describe, it, expect } from "vitest";
import { mapErrorToMcpToolError } from "../../src/errors.js";
import { NapkinHttpError } from "../../src/http.js";

describe("mapErrorToMcpToolError", () => {
  it("maps AbortError to TIMEOUT retriable", () => {
    const err: any = new Error("Aborted");
    err.name = "AbortError";
    const m = mapErrorToMcpToolError(err);
    expect(m.code).toBe("TIMEOUT");
    expect(m.retriable).toBe(true);
  });

  it("maps TypeError to NETWORK_ERROR retriable", () => {
    const m = mapErrorToMcpToolError(new TypeError("network down"));
    expect(m.code).toBe("NETWORK_ERROR");
    expect(m.retriable).toBe(true);
  });

  const table = [
    [400, "BAD_REQUEST", false, "Bad request to Napkin API"],
    [401, "UNAUTHORIZED", false, "Unauthorized: invalid or missing API key"],
    [403, "FORBIDDEN", false, "Forbidden: access denied"],
    [404, "NOT_FOUND", false, "Not found"],
    [410, "GONE", false, "Gone: request has expired"],
    [429, "RATE_LIMITED", true, "Rate limited: slow down and retry"],
    [500, "UPSTREAM_ERROR", true, "Upstream server error"],
  ] as const;

  it.each(table)("maps %s to %s", (status, code, retriable, msg) => {
    const m = mapErrorToMcpToolError(new NapkinHttpError(status, { any: true }));
    expect(m.code).toBe(code);
    expect(m.retriable).toBe(retriable);
    expect(m.message).toBe(msg);
    expect((m as any).original).toEqual({ status, body: { any: true } });
  });

  it("maps unknown error to INTERNAL_ERROR", () => {
    const m = mapErrorToMcpToolError({ foo: "bar" });
    expect(m.code).toBe("INTERNAL_ERROR");
    expect(m.retriable).toBe(false);
    expect(m.message.length).toBeGreaterThan(0);
  });
});
