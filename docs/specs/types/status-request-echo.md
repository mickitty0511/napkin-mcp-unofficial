# Type: StatusRequestEcho

Echo of relevant request parameters in status responses.

```ts
import { z } from "zod";
import { FormatZ } from "./format";
import { OrientationZ } from "./orientation";

export const StatusRequestEchoZ = z.object({
  format: FormatZ.optional(),
  content: z.string().optional(),
  context: z.string().nullable().optional(),
  language: z.string().optional(),
  style_id: z.string().optional(),
  visual_id: z.string().optional(),
  visual_ids: z.array(z.string()).optional(),
  visual_query: z.string().optional(),
  visual_queries: z.array(z.string()).optional(),
  transparent_background: z.boolean().optional(),
  inverted_color: z.boolean().optional(),
  number_of_visuals: z.number().int().optional(),
  orientation: OrientationZ.optional(),
  width: z.number().int().nullable().optional(),
  height: z.number().int().nullable().optional(),
});
export type StatusRequestEcho = z.infer<typeof StatusRequestEchoZ>;
```

Notes
- Mirrors many fields from the create request; values reflect what was applied.

## AI-Assisted Development Artifact

### Step 1 (Documentation)
- Dependencies: Zod, FormatZ, OrientationZ
- Responsibilities: Provide a structured echo of the original request
- I/O: Object schema with optional fields
- Processing Flow: Declare object schema → export type

### Step 2 (Implementation Simulation)
The status endpoint populates these for client diagnostics and provenance; clients can compare with their submitted request.

### Step 3 (Consistency Check)
AI verdict: isGreen=true
message: The schema matches status response fields and remains optional as documented.

## Test Cases

- Accepts any subset of documented optional fields.
- Accepts `context: null`.
- Enforces enums via `FormatZ`/`OrientationZ` in respective fields when present.
