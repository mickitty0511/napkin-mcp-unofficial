# Type: GeneratedFile

Metadata for a generated visual file entry.

```ts
import { z } from "zod";

export const GeneratedFileZ = z.object({
  url: z.string().url(),
  visual_id: z.string().optional(),
  visual_query: z.string().optional(),
  style_id: z.string().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
});
export type GeneratedFile = z.infer<typeof GeneratedFileZ>;
```

Notes
- `url` expires ~30 minutes and requires Authorization headers to download.
- When present, `visual_id`/`visual_query` indicate which selection produced this file.

## AI-Assisted Development Artifact

### Step 1 (Documentation)
- Dependencies: Zod
- Responsibilities: Describe downloadable asset metadata from status
- I/O: Object schema with required `url` and optional metadata
- Processing Flow: Declare object schema → export type

### Step 2 (Implementation Simulation)
Status responses include an array of these; download tooling consumes `url` and attaches headers.

### Step 3 (Consistency Check)
AI verdict: isGreen=true
message: Fields align with status response docs and download guidance.

## Test Cases

- Requires a valid `url` (rejects non-URL strings).
- Optional metadata: accepts presence/absence of `visual_id`, `visual_query`, `style_id`.
- Accepts integer `width`/`height` when present; rejects non-integers.
