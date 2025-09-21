# Claude Agents

This repo includes a specialized Claude agent for normalizing Napkin API docs to Markdown. Use these notes when running or updating Claude-based workflows. Also review `CONTRIBUTING.md` for contribution rules.

## Roles


## Operating Procedure

1) Inputs
   - Local HTML in `docs/pages/*.html`
   - Bundled JS referenced by the HTML (e.g., `/assets/js/main.*.js` + page chunks)

2) Output Targets
   - `docs/mcp-reference/napkin-api-create-visual-request.md`
   - `docs/mcp-reference/napkin-api-get-visual-request-status.md`
   - `docs/mcp-reference/napkin-api-download-visual-file.md`
   - `docs/mcp-reference/napkin-api-styles.md`

2.5) Test Cases in Specs
- For each spec under `docs/specs/**`, include a `## Test Cases` section listing concrete valid/invalid/boundary cases. Keep these synchronized with unit tests under `tests/**`.

3) Authoring Rules (YAML parameters)
   - Capture: `type`, `required`, `nullable`, `format`, `allowed`, `default`, `min`, `max`, `behavior`, `constraints`, `notes`.
   - Exclude deprecated fields (e.g., `context_before`, `context_after`).
   - Preserve path parameters under `path:` as needed.
   - Reflect mutual exclusivity and cross-field constraints.
   - Formatting: for long lists (keywords, enums), emit one item per line to ease diffs.
   - Conventions: keep visual query keywords and style names in English; quote object keys consistently when authoring TS data maps.

### Prompt/Instruction Style (Claude workflows)

- Write instructions in positive, imperative form only (avoid negative phrasing and double negatives).
- Keep language simple, clear, and specific; prefer short sentences and unambiguous verbs.
- State allowed values, defaults, and ranges explicitly.
- Use upstream naming verbatim; avoid synonyms that could confuse model behavior.

4) Operational Notes
   - Authentication required: `Authorization: Bearer …`
   - Status and file URLs expire in ~30 minutes.
   - Use `generated_files[].url` as-is; do not reconstruct; avoid hotlinking.

5) Sanity Checks
   - Endpoints, enums, and constraints match bundled source.
   - Critical notes (expiry, auth, hosting) are present.
   - Heading/section structure is consistent.

## Local Verification

- Run `npm run doc` to expose local Markdown via the MCP server and print the first 60 lines of a doc.
- Run `npm run check` and `npm run build` to ensure types and code remain in sync.
- Always run lint after implementation/updates: `npm run lint`.
  - Review lint findings and decide remediation.
  - If fixes are appropriate, resolve them (use `npm run lint:fix` when safe) to keep style and imports consistent.
- Run `npm run test` to verify unit tests reflect spec changes (Vitest). When updating a spec, update or add tests accordingly.

## PR Notes

- Include a brief "Lint Pass" section in the PR description:
  - Commands run (e.g., `npm run lint`, `npm run lint:fix`).
  - Categories of fixes (type-only imports, script env/globals, unused vars, removed unused eslint directives).
  - Impact statement (non-functional) and confirmation that tests pass.
 - Cross-doc sync: If you update `CLAUDE.md`, `AGENTS.md`, or `CONTRIBUTING.md`, reflect overlapping guidance/policy in the other files to keep them aligned.

## Implementation Notes
- HTTP client: `src/http.ts`
  - Timeout (default 20s), retries for 429/5xx (exponential backoff)
  - Auth: `Authorization: Bearer ${NAPKIN_API_KEY}`
- Error model: `src/errors.ts`
  - Maps Napkin HTTP errors to the spec’s error codes
  - Tool results use `isError: true` and a structured `McpToolError` payload
- Types/Schemas (selected): `src/types/*`
  - `Format`, `Orientation`, `Bcp47String`, `Dimensions`, `GeneratedFile`, `StatusRequestEcho`, `McpToolError` etc.
  - Styles: `src/data/styles-catalog.ts` (internal), selector: `src/tools/styleSelector.ts`
  - Tests: `tests/**` grouped by domain (tools/core/data/resources/types/meta). Align with each spec's `## Test Cases` section.

## Source ↔ Tests Mapping
- This is the mapping of source files to test files.
- Update the mapping when you add or change a source file or test file, or when the src/test folder structure changes.
- See also AGENTS.md and CONTRIBUTING.md.

```yaml
source_to_tests:
  core:
    - source: src/http.ts
      tests:
        - tests/core/http.test.ts
    - source: src/errors.ts
      tests:
        - tests/core/errors.test.ts

  tools:
    - source: src/tools/createVisual.ts
      tests:
        - tests/tools/createVisual.test.ts
    - source: src/tools/regenerateVisual.ts
      tests:
        - tests/tools/regenerateVisual.test.ts
    - source: src/tools/getStatus.ts
      tests:
        - tests/tools/getStatus.test.ts
    - source: src/tools/downloadFile.ts
      tests:
        - tests/tools/downloadFile.test.ts
    - source: src/tools/styleSelector.ts
      tests:
        - tests/tools/styleSelector.test.ts
    - source: src/tools/visualQuerySelector.ts
      tests:
        - tests/tools/visualQuerySelector.test.ts
    - source: src/tools/common.ts
      tests: []
      coverage: indirect
      notes: covered via tool output schema and usage tests

  resources:
    - source: src/resources/docs.ts
      tests:
        - tests/resources/docs.test.ts

  data:
    - source: src/data/styles-catalog.ts
      tests:
        - tests/data/styles-catalog.test.ts
        - tests/tools/styleSelector.test.ts
    - source: src/data/visual-query-keywords.ts
      tests:
        - tests/data/visual-query-keywords.test.ts
        - tests/tools/visualQuerySelector.test.ts

  types:
    - source: src/types/format.ts
      tests:
        - tests/types/schemas.test.ts
    - source: src/types/orientation.ts
      tests:
        - tests/types/schemas.test.ts
    - source: src/types/bcp47-string.ts
      tests:
        - tests/types/schemas.test.ts
    - source: src/types/dimensions.ts
      tests:
        - tests/types/schemas.test.ts
    - source: src/types/generated-file.ts
      tests:
        - tests/types/schemas.test.ts
    - source: src/types/status-request-echo.ts
      tests:
        - tests/types/schemas.test.ts
    - source: src/types/mcp-tool-error.ts
      tests:
        - tests/types/schemas.test.ts
        - tests/core/errors.test.ts
    - source: src/types/style-id.ts
      tests:
        - tests/types/schemas.test.ts
    - source: src/types/styles-catalog.ts
      tests:
        - tests/data/styles-catalog.test.ts
    - source: src/types/visual-id.ts
      tests: []
      coverage: indirect
      notes: enforced via tool/regenerate schema behaviors
    - source: src/types/index.ts
      tests: []
      coverage: indirect
      notes: barrel file covered by importing individual schemas

  meta_entry:
    - source: src/instructions.ts
      tests:
        - tests/meta/instructions.test.ts
    - source: src/index.ts
      tests: []
      coverage: manual_or_e2e
      notes: boots MCP server; not unit-tested directly
```

## References

- Contributing: `CONTRIBUTING.md`
- Agents guide: `AGENTS.md`
