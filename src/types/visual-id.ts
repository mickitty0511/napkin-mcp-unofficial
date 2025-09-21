import { z } from "zod";

export const VisualIdZ = z.string().min(1);
export type VisualId = z.infer<typeof VisualIdZ>;

