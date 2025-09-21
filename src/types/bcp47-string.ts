import { z } from "zod";

export const Bcp47Z = z.string().min(1);
export type Bcp47String = z.infer<typeof Bcp47Z>;

