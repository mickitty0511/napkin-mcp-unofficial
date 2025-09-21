import { z } from "zod";
import type { NapkinHttpClient } from "../http.js";
import { StatusRequestEchoZ, GeneratedFileZ } from "../types/index.js";
import { JobStateZ } from "./common.js";

export const StatusInputZ = z.object({ requestId: z.string().uuid() });
export type GetStatusInput = z.infer<typeof StatusInputZ>;

export const GetStatusOutputZ = z.object({
  id: z.string().uuid(),
  status: JobStateZ,
  request: StatusRequestEchoZ.optional(),
  generated_files: z.array(GeneratedFileZ).optional(),
  _hint: z.string().optional(),
});
export type GetStatusOutput = z.infer<typeof GetStatusOutputZ>;

export async function getStatus(client: NapkinHttpClient, input: GetStatusInput): Promise<GetStatusOutput> {
  const { requestId } = input;
  const { json } = await client.get<any>(`/v1/visual/${encodeURIComponent(requestId)}/status`);
  
  let hint: string | undefined;
  if (json?.status === "completed" && json?.generated_files?.length > 0) {
    const fileCount = json.generated_files.length;
    hint = `Visual generation completed! ${fileCount} file(s) ready for download. Use napkin_download_visual_file to download the generated files.`;
  } else if (json?.status === "failed") {
    hint = "Visual generation failed. Check the status details for error information.";
  } else if (json?.status === "pending") {
    hint = "Visual generation in progress. Check status again in a few moments.";
  }
  
  const mapped = {
    id: json?.id,
    status: json?.status,
    request: json?.request,
    generated_files: json?.generated_files,
    _hint: hint,
  };
  return GetStatusOutputZ.parse(mapped);
}
