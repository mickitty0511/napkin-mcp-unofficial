import { z } from "zod";

export const McpToolErrorZ = z.object({
  code: z.enum([
    "BAD_REQUEST",
    "UNAUTHORIZED",
    "FORBIDDEN",
    "NOT_FOUND",
    "GONE",
    "RATE_LIMITED",
    "UPSTREAM_ERROR",
    "NETWORK_ERROR",
    "TIMEOUT",
    "INTERNAL_ERROR",
  ]),
  message: z.string().min(1),
  retriable: z.boolean().default(false),
  original: z.unknown().optional(),
});

export type McpToolError = z.infer<typeof McpToolErrorZ>;

