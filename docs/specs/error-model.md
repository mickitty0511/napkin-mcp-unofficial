# Error Model & Mapping

For tool errors, return a structured object (also exposed in `tools/list` as JSON Schema via zod-to-json-schema):

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
```

Mapping suggestions
- 400 → BAD_REQUEST
- 401 → UNAUTHORIZED
- 403 → FORBIDDEN
- 404 → NOT_FOUND
- 410 → GONE
- 429 → RATE_LIMITED
- 5xx → UPSTREAM_ERROR (retriable true when appropriate)
## AI-Assisted Development Artifact

### Step 1 (Documentation)
- Dependencies
  - Zod for error shape definition and JSON Schema export
- Responsibilities
  - Provide a uniform error contract for all tools
  - Map HTTP status classes to stable error codes suitable for clients
  - Indicate retriability and optionally carry original payload
- I/O
  - Input: upstream HTTP error (status, message, body)
  - Output: McpToolError (code, message, retriable, original)
- Processing Flow
  1) Inspect upstream status
  2) Map to canonical error code
  3) Compose message and retriable flag
  4) Attach `original` safely if useful (redact secrets)

### Step 2 (Implementation Simulation)
On catching an error from the Napkin API, the tool builds `McpToolErrorZ` by mapping status, setting `retriable` for transient categories (e.g., some 5xx/429), and copying a sanitized `original` for diagnostics.

### Step 3 (Consistency Check)
AI verdict: isGreen=true
message: The mapping rules and output structure align with the defined Zod schema and usage across tools.

## Test Cases

- Schema: accepts only documented `code` values; requires non-empty `message`; `retriable` boolean with default false; `original` optional.
- Mapping: HTTP 400→BAD_REQUEST, 401→UNAUTHORIZED, 403→FORBIDDEN, 404→NOT_FOUND, 410→GONE, 429→RATE_LIMITED, 5xx→UPSTREAM_ERROR.
- Retriable: true for 429 and 5xx; false for other 4xx.
- AbortError maps to `TIMEOUT` with `retriable: true`.
- Network TypeError maps to `NETWORK_ERROR` with `retriable: true`.
- `original`: when available, includes `{ status, body }` in a sanitized form.
