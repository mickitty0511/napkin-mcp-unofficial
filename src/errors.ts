import { McpToolErrorZ } from "./types/index.js";
import type { McpToolError } from "./types/index.js";
import { NapkinHttpError } from "./http.js";

export function mapErrorToMcpToolError(err: unknown): McpToolError {
  // Timeout or abort
  if (isAbortError(err)) {
    return {
      code: "TIMEOUT",
      message: "Request timed out contacting Napkin API",
      retriable: true,
    };
  }

  // Network errors (TypeError from fetch)
  if (err instanceof TypeError) {
    const causeMsg = (err as any)?.cause?.message as string | undefined;
    const message = causeMsg ? `${err.message}: ${causeMsg}` : (err.message || "Network error contacting Napkin API");
    return {
      code: "NETWORK_ERROR",
      message,
      retriable: true,
    };
  }

  if (err instanceof NapkinHttpError) {
    const status = err.status;
    const code = httpStatusToCode(status);
    return sanitizeOriginal({
      code,
      message: humanMessageForStatus(status),
      retriable: status === 429 || (status >= 500 && status < 600),
      original: { status, body: err.body },
    });
  }

  return { code: "INTERNAL_ERROR", message: toErrorMessage(err), retriable: false };
}

function isAbortError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as any).name === "AbortError"
  );
}

function httpStatusToCode(status: number): McpToolError["code"] {
  if (status === 400) return "BAD_REQUEST";
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 410) return "GONE";
  if (status === 429) return "RATE_LIMITED";
  if (status >= 500) return "UPSTREAM_ERROR";
  return "INTERNAL_ERROR";
}

function humanMessageForStatus(status: number): string {
  const map: Record<number, string> = {
    400: "Bad request to Napkin API",
    401: "Unauthorized: invalid or missing API key",
    403: "Forbidden: access denied",
    404: "Not found",
    410: "Gone: request has expired",
    429: "Rate limited: slow down and retry",
  };
  if (map[status]) return map[status];
  if (status >= 500) return "Upstream server error";
  return `HTTP ${status}`;
}

function sanitizeOriginal<T extends McpToolError>(err: T): T {
  // Ensure it matches schema and limit size if needed in future
  const parsed = McpToolErrorZ.parse(err);
  return parsed as T;
}

function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}
