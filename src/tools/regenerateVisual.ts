import { z } from "zod";
import type { ZodTypeAny } from "zod";
import type { NapkinHttpClient } from "../http.js";
import {
  FormatZ,
  OrientationZ,
  Bcp47Z,
  StatusRequestEchoZ,
  GeneratedFileZ,
  StyleIdZ,
} from "../types/index.js";
import { JobStateZ } from "./common.js";
import { selectStyleId } from "./styleSelector.js";

export const RegenerateVisualInputShape = {
  format: FormatZ,
  content: z.string().min(1, "content is required"),
  context: z.string().nullable().optional(),
  language: Bcp47Z.optional(),
  style_id: StyleIdZ.trim().optional(),

  visual_id: z.string().trim().optional(),
  visual_ids: z.array(z.string().min(1)).min(1).optional(),

  number_of_visuals: z.number().int().min(1).max(4).default(1).optional(),
  transparent_background: z.boolean().default(false).optional(),
  inverted_color: z.boolean().default(false).optional(),

  width: z.number().int().min(100).max(10_000).nullable().optional(),
  height: z.number().int().min(100).max(10_000).nullable().optional(),

  orientation: OrientationZ.optional(),
} satisfies Record<string, ZodTypeAny>;

export const RegenerateVisualInputZ = z
  .object(RegenerateVisualInputShape)
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
  status: JobStateZ,
  request: StatusRequestEchoZ.optional(),
  generated_files: z.array(GeneratedFileZ).optional(),
  statusUrl: z.string().url().optional(),
});

export type RegenerateVisualInput = z.infer<typeof RegenerateVisualInputZ>;
export type RegenerateVisualOutput = z.infer<typeof RegenerateVisualOutputZ>;

export async function regenerateVisual(
  client: NapkinHttpClient,
  input: RegenerateVisualInput
): Promise<RegenerateVisualOutput> {
  const style_id = input.style_id?.trim() ||
    selectStyleId(input.content, { context: input.context ?? undefined, language: input.language });
  const payload = { ...input, style_id };
  const { json } = await client.post<any>("/v1/visual", payload);
  const id: string | undefined = json?.id;
  const statusUrl = id ? `${process.env.NAPKIN_API_BASE ?? "https://api.napkin.ai"}/v1/visual/${id}/status` : undefined;
  const mapped = {
    id: json?.id,
    status: json?.status,
    request: json?.request,
    generated_files: json?.generated_files,
    statusUrl,
  };
  return RegenerateVisualOutputZ.parse(mapped);
}

