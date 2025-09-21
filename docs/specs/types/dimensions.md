# Type: Dimensions

Dimensions for PNG conversion; SVG scales naturally.

```ts
import { z } from "zod";

export const DimensionsZ = z.object({
  width: z.number().int().min(100).max(10_000).nullable().optional(),
  height: z.number().int().min(100).max(10_000).nullable().optional(),
});
export type Dimensions = z.infer<typeof DimensionsZ>;
```

Notes
- Set only one of width or height. If both are provided, width takes precedence; the other dimension is inferred to preserve aspect ratio.
- Bounds: 100–10,000 pixels.

## AI-Assisted Development Artifact

### Step 1 (Documentation)
- Dependencies: Zod
- Responsibilities: Constrain pixel dimensions and express precedence
- I/O: Object with optional/nullable integer fields
- Processing Flow: Declare object schema with bounds → export type

### Step 2 (Implementation Simulation)
The create request schema enforces precedence and computes the missing dimension at rendering time; this type captures the allowed range.

### Step 3 (Consistency Check)
AI verdict: isGreen=true
message: The constraints and precedence match the docs and are referenced by request validation.

## Test Cases

- Accepts integers 100..10_000 for `width`/`height`; rejects 99 and 10_001.
- Accepts `null` and omission for either dimension.
- Notes precedence: if both provided, width takes priority (enforced at consumer logic; schema allows both).
