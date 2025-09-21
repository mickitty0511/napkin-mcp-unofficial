# Tool: napkin_download_visual_file

Download a specific generated file via `GET /v1/visual/{request-id}/file/{file-id}`. The tool returns guidance and headers, not the binary content itself.

## TypeScript types

```ts
export type DownloadInput =
  | { downloadUrl: string }
  | { requestId: string; fileId: string };

export interface DownloadOutput {
  advisory: string;
  headersRequired: { Authorization: string }; // "Bearer ..."
  suggestedFilename?: string;
}
```

## Zod schemas

```ts
import { z } from "zod";

export const DownloadByUrlZ = z.object({ downloadUrl: z.string().url() });
export const DownloadByIdsZ = z.object({ requestId: z.string().uuid(), fileId: z.string().min(1) });

export const DownloadInputZ = z.union([DownloadByUrlZ, DownloadByIdsZ]);

export const DownloadOutputZ = z.object({
  advisory: z.string().min(1),
  headersRequired: z.object({
    Authorization: z.string().startsWith("Bearer "),
  }),
  suggestedFilename: z.string().optional(),
});
```

## Notes

- Use the exact URL returned by the status endpoint’s `generated_files`. Do not construct manually.
- Always include the Bearer token when downloading.

## AI-Assisted Development Artifact

### Step 1 (Documentation)
- Dependencies
  - Zod for validating either a full `downloadUrl` or `{requestId, fileId}` tuple
  - Auth header construction logic (Bearer)
- Responsibilities
  - Accept a download target and produce guidance plus required headers
  - Avoid streaming binary; keep responsibility limited to metadata and instructions
  - Reinforce 30‑minute expiry and non-hotlink guidance
- I/O
  - Input: DownloadInput (union of URL or ids)
  - Output: DownloadOutput (advisory, headersRequired, optional filename)
- Processing Flow
  1) Validate input form (URL vs. ids)
  2) If ids form, construct canonical URL or reference, then generate advisory
  3) Return headersRequired with Bearer token notation

### Step 2 (Implementation Simulation)
The tool examines the provided input, validates it with Zod, and returns an advisory string describing expiry and hosting guidance. It provides an `Authorization` header template for callers to use when performing the actual HTTP download.

### Step 3 (Consistency Check)
AI verdict: isGreen=true
message: The artifact matches the file’s scope—no binary handling, clear I/O, and constraints consistent with the notes.

## Test Cases

- Union acceptance: accepts `{ downloadUrl }` object and `{ requestId, fileId }` object; rejects mismatched shapes.
- Canonical URL (ids form): constructs `${base}/v1/visual/{requestId}/file/{fileId}` using configured base, trimming trailing `/` and URL-encoding both ids.
- Headers: returns `headersRequired.Authorization` that starts with `Bearer `; picks up environment token when set.
- Advisory: includes the URL, 30‑minute expiry guidance, and “Do not hotlink” note.
- Filename: `suggestedFilename` is `optional`/`undefined` (callers derive from Content-Disposition during download).
