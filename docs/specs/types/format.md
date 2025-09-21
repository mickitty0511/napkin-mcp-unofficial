# Type: Format

Supported output formats for visual generation.

```ts
import { z } from "zod";

export const FormatZ = z.enum(["svg", "png", "ppt"]);
export type Format = z.infer<typeof FormatZ>;
```

Notes
- Used in Create Visual requests and echoed in status.
- `svg` scales natively; `png` respects Dimensions; `ppt` exports a presentation.

## AI-Assisted Development Artifact

### Step 1 (Documentation)
- Dependencies: Zod
- Responsibilities: Represent the allowed output formats
- I/O: Declarative enum type
- Processing Flow: Declare enum → export TS type

### Step 2 (Implementation Simulation)
A simple enum validated at runtime with Zod; consumers import `FormatZ` to validate inputs and `Format` as the static type.

### Step 3 (Consistency Check)
AI verdict: isGreen=true
message: The enum matches the documented formats and is used consistently across tools.

## Test Cases

- Accepts only `"svg"`, `"png"`, `"ppt"`.
- Rejects unknown strings (e.g., `"pdf"`, `"jpg"`).
