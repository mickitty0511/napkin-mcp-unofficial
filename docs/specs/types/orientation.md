# Type: Orientation

Orientation hint for generated visuals.

```ts
import { z } from "zod";

export const OrientationZ = z.enum(["auto", "horizontal", "vertical", "square"]);
export type Orientation = z.infer<typeof OrientationZ>;
```

Notes
- May take priority over `visual_query`/`visual_queries` when no layouts satisfy both.
- Defaults to `auto` when omitted.

## AI-Assisted Development Artifact

### Step 1 (Documentation)
- Dependencies: Zod
- Responsibilities: Constrain orientation hints to supported values
- I/O: Declarative enum type
- Processing Flow: Declare enum → export TS type

### Step 2 (Implementation Simulation)
Consumers validate `orientation` via `OrientationZ` and adapt logic to prefer orientation when conflicts arise with query selection.

### Step 3 (Consistency Check)
AI verdict: isGreen=true
message: Values align with the docs; precedence note captured in the spec.

## Test Cases

- Accepts only `"auto"`, `"horizontal"`, `"vertical"`, `"square"`.
- Rejects unknown strings.
