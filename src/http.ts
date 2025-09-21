import { setTimeout as sleep } from "node:timers/promises";

export interface HttpClientOptions {
  baseUrl?: string;
  apiKey?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

export class NapkinHttpClient {
  private baseUrl: string;
  private apiKey: string;
  private timeoutMs: number;
  private maxRetries: number;
  private debugEnabled: boolean;

  constructor(opts: HttpClientOptions = {}) {
    this.baseUrl = (opts.baseUrl ?? process.env.NAPKIN_API_BASE ?? "https://api.napkin.ai").replace(/\/$/, "");
    const key = opts.apiKey ?? process.env.NAPKIN_API_KEY;
    if (!key) {
      throw new Error("Missing NAPKIN_API_KEY environment variable");
    }
    this.apiKey = key;
    this.timeoutMs = opts.timeoutMs ?? 20_000;
    this.maxRetries = Math.max(0, opts.maxRetries ?? 2);
    this.debugEnabled = this.envTruthy(process.env.NAPKIN_HTTP_DEBUG);
  }

  private authHeaders(): Record<string, string> {
    return { Authorization: `Bearer ${this.apiKey}` };
  }

  async get<T>(path: string): Promise<{ status: number; json: T }> {
    return this.request<T>("GET", path);
  }

  async post<T>(path: string, body: unknown): Promise<{ status: number; json: T }> {
    return this.request<T>("POST", path, body);
  }

  private async request<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<{ status: number; json: T }> {
    const url = path.startsWith("http") ? path : `${this.baseUrl}${path}`;
    let attempt = 0;
    let lastErr: unknown;
    while (attempt <= this.maxRetries) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);
        try {
          this.dlog(`HTTP -> ${method} ${url} (attempt ${attempt + 1}/${this.maxRetries + 1})`);
          if (this.debugEnabled && body !== undefined) {
            // Avoid dumping huge payloads; keep to ~500 chars
            const payload = safeStringify(body);
            this.dlog(`  body: ${truncate(payload, 500)}`);
          }
          const res = await fetch(url, {
            method,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "User-Agent": "napkin-mcp-server-unofficial/0.1.0",
              ...this.authHeaders(),
            },
            body: body !== undefined ? JSON.stringify(body) : undefined,
            signal: controller.signal,
          } as RequestInit);
          clearTimeout(timer);

          const status = res.status;
          const text = await res.text();
          const rawHeaders: unknown = (res as any).headers;
          const hasGet = rawHeaders && typeof (rawHeaders as any).get === "function";
          const contentType = hasGet ? ((rawHeaders as any).get("content-type") ?? "") : "";
          const shouldParseJson = !hasGet || contentType.includes("application/json");
          let parsed: unknown = {};
          if (text) {
            if (shouldParseJson) {
              try {
                parsed = JSON.parse(text);
              } catch (parseErr) {
                this.dlog(`JSON parse error: ${parseErr instanceof Error ? parseErr.message : String(parseErr)}`);
                this.dlog(`Response text: ${truncate(text, 1000)}`);
                this.dlog(`Content-Type: ${contentType}`);
                throw parseErr;
              }
            } else {
              parsed = { raw: text };
            }
          }

          const reqId = hasGet ? (res as any).headers.get("x-request-id") ?? undefined : undefined;
          this.dlog(`HTTP <- ${status} ${method} ${url}${reqId ? ` (x-request-id: ${reqId})` : ""}`);
          if (this.debugEnabled && status >= 400) {
            this.dlog(`  error body: ${truncate(text, 500)}`);
          }
          const json = parsed as T;

          if (status >= 200 && status < 300) {
            return { status, json };
          }

          // Retry on 429 and transient 5xx except 501/505 etc.
          const retriable = status === 429 || (status >= 500 && status < 600);
          if (!retriable || attempt === this.maxRetries) {
            const err = new NapkinHttpError(status, json);
            // attach request URL for downstream diagnostics
            (err as NapkinHttpError & { requestUrl?: string }).requestUrl = url;
            throw err;
          }
        } finally {
          // timer already cleared above
        }
      } catch (err) {
        lastErr = err;
        // Abort/timeout or network error: retry if budget remains
        const retriable =
          err instanceof NapkinHttpError
            ? err.status === 429 || (err.status >= 500 && err.status < 600)
            : true;
        if (!retriable || attempt === this.maxRetries) {
          this.dlog(
            `HTTP xx ${method} ${url} failed (attempt ${attempt + 1}/${this.maxRetries + 1}) retriable=${retriable}: ${err instanceof Error ? err.name + ": " + err.message : String(err)}`
          );
          throw err;
        }
        const backoffMs = this.backoff(attempt);
        this.dlog(
          `HTTP .. retrying ${method} ${url} in ${Math.round(backoffMs)}ms (attempt ${attempt + 2}/${this.maxRetries + 1})`
        );
        await sleep(backoffMs);
      }
      attempt += 1;
    }
    throw lastErr ?? new Error("Unknown HTTP error");
  }

  private backoff(attempt: number): number {
    const base = 300; // ms
    const jitter = Math.random() * 200;
    return Math.min(5_000, base * 2 ** attempt + jitter);
  }

  private envTruthy(v: string | undefined): boolean {
    if (!v) return false;
    const s = v.trim().toLowerCase();
    return s === "1" || s === "true" || s === "yes" || s === "on";
  }

  private dlog(msg: string): void {
    if (this.debugEnabled) {
      // Single-line logs for easy grepping
      console.log(`[napkin:http] ${msg}`);
    }
  }
}

export class NapkinHttpError<T = unknown> extends Error {
  // requestUrl is optional and populated by the client for diagnostics
  public requestUrl?: string;

  constructor(public status: number, public body: T) {
    super(`Napkin API error ${status}`);
  }
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + `… (truncated ${s.length - max} chars)` : s;
}

function safeStringify(v: unknown): string {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}
