# Tool: napkin_create_visual_request

Create a new visual generation request via `POST /v1/visual`.

## TypeScript types

```ts
import { Format, Orientation, Bcp47String, StatusRequestEcho, GeneratedFile } from "./types";

export interface CreateVisualRequest {
  format: Format;
  content: string;
  context?: string | null;
  language?: Bcp47String;
  style_id?: string;

  // Provide at most one of the following selection methods
  visual_query?: string;
  visual_queries?: string[];

  number_of_visuals?: number; // 1..4, default 1
  transparent_background?: boolean; // default false
  inverted_color?: boolean; // default false
  width?: number | null; // PNG only
  height?: number | null; // PNG only
  orientation?: Orientation; // auto|horizontal|vertical|square
}

export interface CreateVisualResponse {
  id: string; // uuid
  status: "pending" | "completed" | "failed";
  request?: StatusRequestEcho;
  generated_files?: GeneratedFile[];
  // Optional convenience field (derived by tool implementation, not upstream):
  statusUrl?: string; // e.g., `https://api.napkin.ai/v1/visual/${id}/status`
}
```

## Zod schemas

```ts
import { z } from "zod";
import { FormatZ, OrientationZ, Bcp47Z, StatusRequestEchoZ, GeneratedFileZ } from "./types";

export const CreateVisualInputZ = z
  .object({
    format: FormatZ,
    content: z.string().min(1, "content is required"),
    context: z.string().nullable().optional(),
    language: Bcp47Z.optional(),
    style_id: z.string().trim().optional(),

    visual_query: z.string().trim().optional(),
    visual_queries: z.array(z.string().min(1)).min(1).optional(),

    number_of_visuals: z.number().int().min(1).max(4).default(1).optional(),
    transparent_background: z.boolean().default(false).optional(),
    inverted_color: z.boolean().default(false).optional(),

    width: z.number().int().min(100).max(10_000).nullable().optional(),
    height: z.number().int().min(100).max(10_000).nullable().optional(),

    orientation: OrientationZ.optional(),
  })
  .superRefine((val, ctx) => {
    const provided = [
      !!val.visual_query,
      !!val.visual_queries,
    ].filter(Boolean).length;
    if (provided > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide only one of visual_query | visual_queries",
        path: ["visual_query"],
      });
    }
    // Dimensions are PNG-only: reject when format is not png
    if (val.format !== "png" && (val.width != null || val.height != null)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "width/height are allowed only when format is 'png'",
        path: ["width"],
      });
    }
  });

export const CreateVisualOutputZ = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "completed", "failed"]),
  request: StatusRequestEchoZ.optional(),
  generated_files: z.array(GeneratedFileZ).optional(),
  statusUrl: z.string().url().optional(), // helper
});
```

## Notes

- width/height are used for PNG conversion only; SVG scales naturally.
- Validation: If `format` is not `png`, providing `width` or `height` is rejected.
- If both width and height are provided, width takes precedence; the other dimension is inferred.
- Orientation may take priority over query selection.
- visual_id / visual_ids are handled by a separate Regenerate tool; see `tool-regenerate-visual.md`.
- Method selection: Change structure (keep content)  Euse this Create tool. Change content only (keep layout)  Euse `napkin.regenerate_visual`.

### Query & Style Guidance (MCP behavior)
- visual_query / visual_queries
  - Use English strings (e.g., "timeline", "flowchart", "mind map", "funnel", "pyramid").
  - Agents should infer suitable layout types semantically from `content` + `context` (not only keyword matches).
  - When `number_of_visuals > 1`, provide distinct queries equal to `number_of_visuals`.
  - Optional hints: see `docs/visual_variations/visual_query_keywords_by_category.md`.

- style_id
  - Optional; if omitted, the MCP server applies this precedence for selection:
    1) `NAPKIN_DEFAULT_STYLE_ID` environment override (if set)
    2) Explicit hints found in `content`/`context` (English style name or exact style ID)
    3) Neutral fallback: formal category preferred style ("Subtle Accent")
  - To lock a specific style, pass its `style_id` explicitly.
  - Use English style names in text hints; consult `docs/visual_variations/style_keywords_by_category.md` for names and IDs.

## AI-Assisted Development Artifact

### Step 1 (Documentation)
- Dependencies
  - Reusable types/schemas from `./types`
  - Zod for input/output validation and JSON Schema export
- Responsibilities
  - Define the input contract for `POST /v1/visual`
  - Enforce mutual exclusivity among `visual_query` and `visual_queries`
  - Capture defaults, bounds (width/height), and orientation behavior
  - Describe the response shape including optional request echo and generated_files
- I/O
  - Input: CreateVisualRequest (fields, defaults, constraints)
  - Output: CreateVisualResponse (id, status, optional echo, files)
- Processing Flow
  1) Validate basic fields and enums
  2) Enforce mutual exclusivity and `number_of_visuals` pairing for queries
  3) Apply dimension precedence (width over height) and bounds
  4) Produce a normalized response model for downstream status polling

### Step 2 (Implementation Simulation)
The implementation accepts a structured request, validates it using the Zod schema, and performs logical checks for exclusivity and dimensions. It then calls the upstream endpoint, captures the upstream response, and maps it into the response type, optionally adding a convenience `statusUrl` to guide polling.

### Step 3 (Consistency Check)
AI verdict: isGreen=true
message: The responsibilities, constraints, and flow align with the documented input/output and match the upstream spec semantics.

## Test Cases

- Valid minimal: `format: "svg"`, `content: "Hello"`; accepts defaults.
- Context/language optional: accepts `context: null` and `language: "en-US"`.
- Mutual exclusivity: providing both `visual_query` and `visual_queries` yields validation error.
- visual_queries cardinality: when `number_of_visuals = 3`, `visual_queries.length` must be 3; mismatch errors.
- Dimensions bounds: `width`/`height` must be integers in [100, 10000]; 99 and 10001 rejected; `null` accepted.
- Orientation enum: accept only `auto|horizontal|vertical|square`; others rejected.
- Style id handling: trims whitespace; when omitted, implementation may auto-select per precedence (env explicit hint, formal fallback).
- POST payload: includes resolved `style_id`; response maps to `CreateVisualOutputZ`.
- statusUrl: when `id` present, `statusUrl` is a valid URL built from base + `/v1/visual/{id}/status`.

