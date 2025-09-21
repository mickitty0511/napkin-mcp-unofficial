# Type: McpToolError

Uniform error contract for tools.

```ts
import { z } from "zod";

export const McpToolErrorZ = z.object({
  code: z.enum([
    "BAD_REQUEST", "UNAUTHORIZED", "FORBIDDEN", "NOT_FOUND", "GONE",
    "RATE_LIMITED", "UPSTREAM_ERROR", "NETWORK_ERROR", "TIMEOUT", "INTERNAL_ERROR",
  ]),
  message: z.string().min(1),
  retriable: z.boolean().default(false),
  original: z.unknown().optional(),
});
export type McpToolError = z.infer<typeof McpToolErrorZ>;
```

Notes
- Map HTTP statuses to codes (400→BAD_REQUEST, 401→UNAUTHORIZED, 403→FORBIDDEN, 404→NOT_FOUND, 410→GONE, 429→RATE_LIMITED, 5xx→UPSTREAM_ERROR).
- Set `retriable` for transient cases (some 5xx/429).
- Redact secrets when including `original`.

## AI-Assisted Development Artifact

### Step 1 (Documentation)
- Dependencies: Zod
- Responsibilities: Provide stable, client-friendly error surface
- I/O: Structured error object with code/message/retriable/original
- Processing Flow: Declare object schema → export type

### Step 2 (Implementation Simulation)
On failure, tools build this object from upstream responses and internal context, ensuring consistent handling and diagnostics.

### Step 3 (Consistency Check)
AI verdict: isGreen=true
message: The schema and mapping guidance are consistent with the error model spec.

## Test Cases

- Accepts only documented `code` enum values.
- Requires non-empty `message`.
- `retriable` defaults to `false` when omitted.
- `original` optional; accepts any JSON-serializable value.
