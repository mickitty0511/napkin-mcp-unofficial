import { z } from "zod";

// Identifier for a visual style (built-in or custom)
export const StyleIdZ = z.string().min(1);
export type StyleId = z.infer<typeof StyleIdZ>;

