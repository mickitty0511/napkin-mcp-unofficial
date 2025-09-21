import { z } from "zod";

export const DimensionsZ = z.object({
  width: z.number().int().min(100).max(10_000).nullable().optional(),
  height: z.number().int().min(100).max(10_000).nullable().optional(),
});
export type Dimensions = z.infer<typeof DimensionsZ>;

