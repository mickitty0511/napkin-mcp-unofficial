# Type: StylesCatalog (includes StyleId)

Schema for the built-in Styles catalog and the `style_id` used in requests.

```ts
import { z } from "zod";

// Identifier for a visual style (built-in or custom)
export const StyleIdZ = z.string().min(1);
export type StyleId = z.infer<typeof StyleIdZ>;

// Single style entry
export const StyleItemZ = z.object({
  name: z.string().min(1),
  id: StyleIdZ,
  description: z.string().min(1),
});
export type StyleItem = z.infer<typeof StyleItemZ>;

// Category grouping
export const StyleCategoryZ = z.object({
  label: z.string().min(1),
  items: z.array(StyleItemZ).min(1),
});
export type StyleCategory = z.infer<typeof StyleCategoryZ>;

// Known category keys from upstream docs
export const StylesCategoryKeyZ = z.enum([
  "colorful",
  "casual",
  "hand_drawn",
  "formal",
  "monochrome",
]);
export type StylesCategoryKey = z.infer<typeof StylesCategoryKeyZ>;

// Built-in styles section
export const BuiltInStylesZ = z
  .object({
    total: z.number().int().min(0),
    categories: z
      .object({
        colorful: StyleCategoryZ,
        casual: StyleCategoryZ,
        hand_drawn: StyleCategoryZ,
        formal: StyleCategoryZ,
        monochrome: StyleCategoryZ,
      })
      .strict(),
  })
  .superRefine((val, ctx) => {
    const sum = Object.values(val.categories).reduce(
      (acc, cat) => acc + cat.items.length,
      0
    );
    if (sum !== val.total) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `built_in_styles.total (${val.total}) does not equal sum of items (${sum})`,
        path: ["total"],
      });
    }
  });
export type BuiltInStyles = z.infer<typeof BuiltInStylesZ>;

// Full catalog wrapper
export const StylesCatalogZ = z.object({
  built_in_styles: BuiltInStylesZ,
});
export type StylesCatalog = z.infer<typeof StylesCatalogZ>;
```

Notes
- Source: https://api.napkin.ai/docs/styles (see `docs/napkin-api-styles.md` for a current snapshot).
- `style_id` is optional in create requests; if omitted, an upstream default may be chosen.
- MCP implementation selection precedence when `style_id` is omitted:
  1) `NAPKIN_DEFAULT_STYLE_ID` environment override (if set)
  2) Explicit hints found in `content`/`context` (English style name or exact style ID)
  3) Neutral fallback: formal category preferred style ("Subtle Accent")
  Use English style names when providing hints; see `docs/visual_variations/style_keywords_by_category.md` for names and IDs.
- IDs and the catalog can change over time; do not hardcode IDs in clients beyond tests.
- For `ppt` exports, custom fonts in custom styles are not supported yet; prefer standard web fonts.
- Consider exposing the catalog via an MCP Resource for discovery; keep this spec as the runtime shape.

## AI-Assisted Development Artifact

### Step 1 (Documentation)
- Dependencies: Zod
- Responsibilities: Model style identifiers and the built-in styles catalog (categories, items, total)
- I/O: Declarative schemas with a cross-check ensuring `total` equals the sum of category items
- Processing Flow: Declare primitives->compose categories->wrap catalog->add validation

### Step 2 (Implementation Simulation)
Consumers import `StyleIdZ` for request validation (`style_id`) and `StylesCatalogZ` if exposing a resource or validating downloaded catalog snapshots.

### Step 3 (Consistency Check)
AI verdict: isGreen=true
message: Types and schemas mirror upstream fields and naming; no extra fields were added and totals are validated.

## Test Cases

- StyleId: accepts non-empty strings; rejects empty.
- Category/item shapes: require `name`, `id`, `description`; `items` non-empty.
- BuiltInStyles totals: `total` must equal sum of all `categories.*.items.length`; mismatch triggers validation error.
- Full catalog: a real snapshot (e.g., `src/data/styles-catalog.ts`) conforms to `StylesCatalogZ`.
