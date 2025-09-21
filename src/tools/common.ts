import { z } from "zod";

export const JobStateZ = z.enum(["pending", "completed", "failed"]);
export type JobState = z.infer<typeof JobStateZ>;

