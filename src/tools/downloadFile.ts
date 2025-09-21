import { z } from "zod";

export const DownloadByUrlZ = z.object({ 
  downloadUrl: z.string().url(),
  downloadDirectory: z.string().optional(),
});
export const DownloadByIdsZ = z.object({ 
  requestId: z.string().uuid(), 
  fileId: z.string().min(1),
  downloadDirectory: z.string().optional(),
});
export const DownloadInputZ = z.union([DownloadByUrlZ, DownloadByIdsZ]);
export type DownloadInput = z.infer<typeof DownloadInputZ>;

export const DownloadOutputZ = z.object({
  advisory: z.string().min(1),
  headersRequired: z.object({
    Authorization: z.string().startsWith("Bearer "),
  }),
  suggestedFilename: z.string().optional(),
  downloadPath: z.string().optional(),
});
export type DownloadOutput = z.infer<typeof DownloadOutputZ>;

export function buildDownloadAdvice(input: DownloadInput): DownloadOutput {
  const base = process.env.NAPKIN_API_BASE ?? "https://api.napkin.ai";
  const token = process.env.NAPKIN_API_KEY ?? "YOUR_TOKEN_HERE";

  const url = "downloadUrl" in input
    ? input.downloadUrl
    : `${base.replace(/\/$/, "")}/v1/visual/${encodeURIComponent(input.requestId)}/file/${encodeURIComponent(input.fileId)}`;

  const downloadDirectory = input.downloadDirectory || process.cwd();
  const downloadPath = downloadDirectory;

  const advisory = [
    `Use the URL to download the binary file within ~30 minutes of generation:`,
    url,
    `Download directory: ${downloadPath}`,
    `Always include the Authorization header. Do not hotlink these URLs in your UI; download and host files yourself.`,
  ].join("\n");

  const headersRequired = { Authorization: `Bearer ${token}` };
  const suggestedFilename = undefined; // Could be inferred by caller from Content-Disposition after request

  return DownloadOutputZ.parse({ advisory, headersRequired, suggestedFilename, downloadPath });
}

