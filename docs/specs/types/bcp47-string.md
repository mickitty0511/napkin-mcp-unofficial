# Type: Bcp47String

Represents a BCP 47 language tag (e.g., `en`, `en-US`, `ja-JP`).

```ts
import { z } from "zod";

export const Bcp47Z = z.string().min(1);
export type Bcp47String = z.infer<typeof Bcp47Z>;
```


Notes
- Validation is string-only here (no full BCP 47 parsing); examples are enforced by docs and usage.
- We do not maintain a local list of valid tags. When choosing tags, refer to the BCP 47 subtag lookup: https://r12a.github.io/app-subtags/
- Agents should emit language values as BCP 47 strings (e.g., `en`, `en-US`, `ja-JP`), consulting the tool above when needed.

## AI-Assisted Development Artifact

### Step 1 (Documentation)
- Dependencies: Zod
- Responsibilities: Provide a lightweight language tag type
- I/O: String with a minimum length constraint
- Processing Flow: Declare string schema → export TS type

### Step 2 (Implementation Simulation)
Consumers accept user input (headers or fields) and validate non-empty strings. If strict BCP 47 validation is needed, layer an additional validator.

### Step 3 (Consistency Check)
AI verdict: isGreen=true
message: The simplified model matches current docs and usage patterns.

## Test Cases

- Accepts non-empty strings like `"en"`, `"en-US"`, `"ja-JP"`.
- Rejects empty string.
- Type only: does not attempt full BCP 47 structural validation (doc note).
