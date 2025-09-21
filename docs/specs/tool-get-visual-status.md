# Tool: napkin_get_visual_status

Retrieve request status via `GET /v1/visual/{request-id}/status`.

## TypeScript types

```ts
import { StatusRequestEcho, GeneratedFile } from "./types";

export interface GetStatusInput { requestId: string } // uuid

export interface GetStatusOutput {
  id: string; // uuid
  status: "pending" | "completed" | "failed";
  request?: StatusRequestEcho;
  generated_files?: GeneratedFile[];
}
```

## Zod schemas

```ts
import { z } from "zod";
import { OrientationZ, StatusRequestEchoZ, GeneratedFileZ } from "./types";

export const JobStateZ = z.enum(["pending", "completed", "failed"]);

export const StatusInputZ = z.object({
  requestId: z.string().uuid(),
});

export const GetStatusOutputZ = z.object({
  id: z.string().uuid(),
  status: JobStateZ,
  request: StatusRequestEchoZ.optional(),
  generated_files: z.array(GeneratedFileZ).optional(),
});
```

## Notes

- Both status and file URLs expire ~30 minutes after generation.

## AI-Assisted Development Artifact

### Step 1 (Documentation)
- Dependencies
  - Types and schemas from `./types`
  - Zod for request/response validation
- Responsibilities
  - Validate `requestId` format (UUID)
  - Retrieve current state and return normalized response (id, status, request echo, generated_files)
  - Emphasize URL expiry behavior and availability conditions
- I/O
  - Input: GetStatusInput (requestId)
  - Output: GetStatusOutput (id, status, optional echo, optional files)
- Processing Flow
  1) Validate `requestId`
  2) Call upstream status endpoint
  3) Map upstream structure to standardized output
  4) Attach notes about expiry for client consumption

### Step 2 (Implementation Simulation)
The implementation checks the UUID, performs the GET call, and translates the upstream JSON to `GetStatusOutput`. When files exist, it carries through their metadata. It does not download content; it only reports availability and relevant URLs.

### Step 3 (Consistency Check)
AI verdict: isGreen=true
message: The I/O, constraints, and responsibilities are consistent with the documented endpoint and the types it reuses.

## Test Cases

- Input validation: accepts a valid UUID in `requestId`; rejects non-UUID strings.
- GET mapping: typical upstream JSON maps to `GetStatusOutputZ` (id/status/request/generated_files).
- Optional fields: tolerates missing `request` and/or `generated_files`.
- URL encoding: ensures path uses `encodeURIComponent(requestId)` semantics (doc-level check for consumers).
