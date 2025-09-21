import { z } from "zod";

export const OrientationZ = z.enum(["auto", "horizontal", "vertical", "square"]);
export type Orientation = z.infer<typeof OrientationZ>;

