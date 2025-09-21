# Type: VisualId

Identifier for a specific visual layout.

```ts
import { z } from "zod";

export const VisualIdZ = z.string().min(1);
export type VisualId = z.infer<typeof VisualIdZ>;
```

Notes
- Used with regeneration (`visual_id`/`visual_ids`) to recreate exact layouts with new content.
- When using `visual_ids`, the count must equal `number_of_visuals` and all must be unique.

## AI-Assisted Development Artifact

### Step 1 (Documentation)
- Dependencies: Zod
- Responsibilities: Represent a non-empty visual identifier
- I/O: String with min-length constraint
- Processing Flow: Declare string schema → export TS type

### Step 2 (Implementation Simulation)
Consumers use this in selection logic and enforce pairing constraints in request validation.

### Step 3 (Consistency Check)
AI verdict: isGreen=true
message: The identifier spec aligns with constraints documented for regeneration.

## Test Cases

- Accepts non-empty strings; rejects empty string.
- When used in arrays externally, consumers ensure uniqueness and cardinality match (doc note).
