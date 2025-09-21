# Type: VisualSelection (and variants)

Mutually exclusive selection methods for targeting visuals.

```ts
import { z } from "zod";
import { VisualIdZ } from "./visual-id";

export const VisualSelectionByIdZ = z.object({ mode: z.literal("visual_id"), visual_id: VisualIdZ });
export const VisualSelectionByIdsZ = z.object({ mode: z.literal("visual_ids"), visual_ids: z.array(VisualIdZ).min(1) });
export const VisualSelectionByQueryZ = z.object({ mode: z.literal("visual_query"), visual_query: z.string().min(1) });
export const VisualSelectionByQueriesZ = z.object({ mode: z.literal("visual_queries"), visual_queries: z.array(z.string().min(1)).min(1) });

export const VisualSelectionZ = z.union([
  VisualSelectionByIdZ,
  VisualSelectionByIdsZ,
  VisualSelectionByQueryZ,
  VisualSelectionByQueriesZ,
]);
export type VisualSelection = z.infer<typeof VisualSelectionZ>;
```

Notes
- Only one selection method should be provided in a request (enforced at request schema level).
- `visual_ids`/`visual_queries` lengths must match `number_of_visuals` when used.

## AI-Assisted Development Artifact

### Step 1 (Documentation)
- Dependencies: Zod, VisualIdZ
- Responsibilities: Model mutually exclusive selection strategies
- I/O: Discriminated union via a `mode` literal field
- Processing Flow: Declare four shapes → union them → export type

### Step 2 (Implementation Simulation)
Consumers usually validate exclusivity within the create request schema; this discriminated union offers an alternative modeling approach when using a dedicated selection object.

### Step 3 (Consistency Check)
AI verdict: isGreen=true
message: The union captures the four documented strategies and aligns with request-level constraints.

## Test Cases

- Discriminated union acceptance: each of the four shapes with correct `mode` literal validates.
- Exclusivity: only one selection method allowed per selection object.
- Cardinality: `visual_ids` and `visual_queries` require non-empty arrays; when used in requests, lengths must match `number_of_visuals` (enforced at request schema level).
