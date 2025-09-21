import { z } from "zod";

export const FormatZ = z.enum(["svg", "png", "ppt"]);
export type Format = z.infer<typeof FormatZ>;

