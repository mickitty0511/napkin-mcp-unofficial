# Napkin MCP Server Specs

This folder contains split specifications for the Napkin MCP toolset, derived from `docs/specs/*md` and aligned with the Markdown API docs in this repo.

- Overview, links, runtime, auth, responsibilities
- Reusable types (TypeScript + Zod)
- Individual tool specs for create/status/download
- Error model and mapping
- Processing flow and test considerations

See also:
- Create visual request: docs/napkin-api-create-visual-request.md
- Get visual request status: docs/napkin-api-get-visual-request-status.md
- Download generated file: docs/napkin-api-download-visual-file.md
- Styles catalog: docs/napkin-api-styles.md

## Reference Links (original docs)

- Napkin API 101: https://api.napkin.ai/
- Napkin API Styles: https://api.napkin.ai/docs/styles
- Create visual request: https://api.napkin.ai/api/create-visual-request
- Get visual request status: https://api.napkin.ai/api/get-visual-request-status
- Download generated file: https://api.napkin.ai/api/download-visual-file
- Changelog: https://api.napkin.ai/docs/changelog

## Spec Index (latest)

- Types
  - `types.md` (index)
  - `types/format.md`
  - `types/orientation.md`
  - `types/bcp47-string.md`
  - `types/visual-id.md`
  - `types/visual-selection.md`
  - `types/dimensions.md`
  - `types/generated-file.md`
  - `types/status-request-echo.md`
  - `types/mcp-tool-error.md`
  - `types/styles-catalog.md`
- Tools
  - `tool-create-visual-request.md`
  - `tool-regenerate-visual.md`
  - `tool-get-visual-status.md`
  - `tool-download-visual-file.md`
- Error Model
  - `error-model.md`

## Notes
This is an unofficial MCP server for Napkin AI tools. It is not affiliated with Napkin AI.


## Runtime & Dependencies

- MCP server runtime implementing `initialize`, `tools/list`, `tools/call` (optional `resources/*`).
- HTTP client with retry/timeout/backoff for Napkin API calls.
- Secrets management for `NAPKIN_API_KEY` (mask in logs).
- Optional scheduler for polling helpers.
- Optional storage if proxy‑downloading files.
- Schemas: `zod`, `zod-to-json-schema`.

## Authentication

All API calls require a Bearer token:

```
Authorization: Bearer ${NAPKIN_API_KEY}
```

## Responsibilities

- Normalize the async flow (create → status → download) as synchronous MCP tools.
- Enforce strict input/output/error schemas (Zod) and publish JSON Schemas in `tools/list`.
- Propagate auth securely and honor 30‑minute URL expiry.
- Provide clear download guidance (use `generated_files` URL, avoid hotlinking).
- Apply rate limiting, timeouts, retries with backoff.

## Processing Flow

1) Create via `POST /v1/visual`
2) Poll `GET /v1/visual/{id}/status` until `completed|failed`
3) Download via `generated_files[].url` (or ids) with Bearer auth

## Method Selection Guidance

- Change structure (keep content the same): use `napkin.create_visual_request`
  - Optionally guide with `visual_query`/`visual_queries` and `orientation`
- Change content only (keep layout the same): use `napkin.regenerate_visual`
  - Provide `visual_id` or `visual_ids` (exactly one of them)
  - Cardinality must match `number_of_visuals` when using `visual_ids`

Note: If `style_id` is omitted, the server auto-selects a style from its internal catalog. You can override with `NAPKIN_DEFAULT_STYLE_ID`.

## Test Considerations

- Normal: single/multiple visuals; all orientations
- Edge: exclusivity violations; invalid IDs; width/height bounds; expired URLs
- Error: missing/invalid auth; 404/410; 429 backoff; upstream 5xx with retry

## AI-Assisted Development Artifact

### Step 1 (Documentation)
- Dependencies
  - Local docs: `docs/napkin-api-*.md`
  - Spec files in this folder: types, tool specs, error model
  - MCP server runtime and JSON Schema publication via zod-to-json-schema
- Responsibilities
  - Serve as the index/orchestrator for the split specs
  - Link to types and per-tool specs; keep navigation and references consistent
  - Provide environment/runtime/auth/responsibilities overview
- I/O
  - Input: consolidated spec content and API docs locations
  - Output: navigable overview with links to types/tools/errors and reference links
- Processing Flow
  1) Collect references and links
  2) Summarize runtime/auth/responsibilities
  3) List processing flow and test considerations
  4) Publish cross-links to the split spec files

### Step 2 (Implementation Simulation)
This file is produced by extracting top-level concepts from the consolidated spec, then arranging them into a concise overview: dependencies, responsibilities, auth, operational notes, and links to subordinate specs. It ensures developers can quickly discover types and tools while preserving references to source API docs.

### Step 3 (Consistency Check)
AI verdict: isGreen=true
message: The overview matches the split files’ scope, lists dependencies and responsibilities, and provides clear I/O and flow consistent with the rest of the specs.
