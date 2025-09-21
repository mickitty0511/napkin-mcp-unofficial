import { z } from "zod";
import { FormatZ } from "./format.js";
import { OrientationZ } from "./orientation.js";
import { StyleIdZ } from "./style-id.js";

export const StatusRequestEchoZ = z.object({
  format: FormatZ.optional(),
  content: z.string().optional(),
  context: z.string().nullable().optional(),
  language: z.string().optional(),
  style_id: StyleIdZ.optional(),
  visual_id: z.string().optional(),
  visual_ids: z.array(z.string()).optional(),
  visual_query: z.string().optional(),
  visual_queries: z.array(z.string()).optional(),
  transparent_background: z.boolean().optional(),
  inverted_color: z.boolean().optional(),
  number_of_visuals: z.number().int().optional(),
  orientation: OrientationZ.optional(),
  width: z.number().int().nullable().optional(),
  height: z.number().int().nullable().optional(),
});
export type StatusRequestEcho = z.infer<typeof StatusRequestEchoZ>;
