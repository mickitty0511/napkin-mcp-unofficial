import { z } from "zod";
import { StyleIdZ } from "./style-id.js";

export const GeneratedFileZ = z.object({
  url: z.string().url(),
  visual_id: z.string().optional(),
  visual_query: z.string().optional(),
  style_id: StyleIdZ.optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
});
export type GeneratedFile = z.infer<typeof GeneratedFileZ>;
