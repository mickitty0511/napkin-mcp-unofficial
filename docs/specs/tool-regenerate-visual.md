# Tool: napkin_regenerate_visual

Regenerate an existing visual layout using `visual_id` or multiple layouts via `visual_ids` (POST `/v1/visual`).

## TypeScript types

```ts
import { Format, Orientation, Bcp47String, StatusRequestEcho, GeneratedFile } from "./types";

export interface RegenerateVisualRequest {
  format: Format;
  content: string;
  context?: string | null;
  language?: Bcp47String;
  style_id?: string;

  // Provide exactly one of the following
  visual_id?: string;      // implies number_of_visuals = 1
  visual_ids?: string[];   // length must equal number_of_visuals

  number_of_visuals?: number; // 1..4, default 1
  transparent_background?: boolean; // default false
  inverted_color?: boolean; // default false
  width?: number | null; // PNG only
  height?: number | null; // PNG only
  orientation?: Orientation; // auto|horizontal|vertical|square
}

export interface RegenerateVisualResponse {
  id: string; // uuid
  status: "pending" | "completed" | "failed";
  request?: StatusRequestEcho;
  generated_files?: GeneratedFile[];
  statusUrl?: string; // convenience field
}
```

## Zod schemas

```ts
import { z } from "zod";
import { FormatZ, OrientationZ, Bcp47Z, StatusRequestEchoZ, GeneratedFileZ } from "./types";

export const RegenerateVisualInputZ = z
  .object({
    format: FormatZ,
    content: z.string().min(1, "content is required"),
    context: z.string().nullable().optional(),
    language: Bcp47Z.optional(),
    style_id: z.string().trim().optional(),

    visual_id: z.string().trim().optional(),
    visual_ids: z.array(z.string().min(1)).min(1).optional(),

    number_of_visuals: z.number().int().min(1).max(4).default(1).optional(),
    transparent_background: z.boolean().default(false).optional(),
    inverted_color: z.boolean().default(false).optional(),

    width: z.number().int().min(100).max(10_000).nullable().optional(),
    height: z.number().int().min(100).max(10_000).nullable().optional(),

    orientation: OrientationZ.optional(),
  })
  .superRefine((val, ctx) => {
    const provided = [!!val.visual_id, !!val.visual_ids].filter(Boolean).length;
    if (provided !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide exactly one of visual_id or visual_ids",
        path: ["visual_id"],
      });
    }
    if (val.visual_id && val.number_of_visuals && val.number_of_visuals > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "visual_id cannot be used when number_of_visuals > 1",
        path: ["visual_id"],
      });
    }
    if (
      val.visual_ids &&
      val.number_of_visuals &&
      val.visual_ids.length !== val.number_of_visuals
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "visual_ids length must equal number_of_visuals",
        path: ["visual_ids"],
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

export const RegenerateVisualOutputZ = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "completed", "failed"]),
  request: StatusRequestEchoZ.optional(),
  generated_files: z.array(GeneratedFileZ).optional(),
  statusUrl: z.string().url().optional(),
});
```

## Notes

- Regeneration preserves the original layout(s) designated by `visual_id`/`visual_ids` while applying new content and style.
- `width/height` affect PNG conversion only; SVG scales naturally.
- Validation: If `format` is not `png`, providing `width` or `height` is rejected.
- `style_id` is optional; server may select a default if omitted. Our implementation may auto-pick a style if none is provided.
- Method selection: Change content-only (keep layout) → use this Regenerate tool. Change structure (keep content) → use `napkin.create_visual_request`.

## AI-Assisted Development Artifact

### Step 1 (Documentation)
- Dependencies: types/schemas from `./types`, Zod
- Responsibilities: Provide a focused contract for layout regeneration via id(s)
- I/O: Inputs with id(s), count, and rendering options; output mirrors create/status
- Flow: Validate exclusivity and cardinality -> call upstream -> normalize response

### Step 2 (Implementation Simulation)
Implementation uses the shared HTTP client to call `POST /v1/visual` with id-based selection. Style auto-selection is applied when not provided.

### Step 3 (Consistency Check)
AI verdict: isGreen=true
message: The separation clarifies create vs. regenerate responsibilities while preserving upstream semantics.

## Test Cases

- Valid minimal by single id: accepts `visual_id` with `number_of_visuals` omitted or 1.
- Valid by ids array: accepts `visual_ids: ["id1","id2"]` with `number_of_visuals: 2`.
- Exclusivity: providing both `visual_id` and `visual_ids` yields validation error; providing neither also errors.
- Cardinality: `visual_ids.length !== number_of_visuals` yields validation error.
- Single id with multi-count: `visual_id` with `number_of_visuals > 1` errors.
- Dimensions/orientation/language: same bounds and enums as Create; invalid values rejected.
- Style selection: trims provided `style_id`; when omitted, implementation may auto-select per precedence.
- POST payload/response: mapped into `RegenerateVisualOutputZ`; `statusUrl` constructed when `id` present.
