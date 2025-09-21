# Agents Guide

This repository uses lightweight agent playbooks to keep documentation and code in sync. If you are authoring or running agents (CLI, IDE assistants, or CI bots), follow the workflow below. For contributor guidance, also see `CONTRIBUTING.md`.

## Goals

- Keep specs and implementation aligned (no drift).
- Preserve upstream API naming/behavior (snake_case, defaults, constraints).
- Make changes auditable and minimal.

## Scope

- Specs under `docs/specs/**` (types, tools, error model, index pages)
- Canonical Markdown API docs under `docs/mcp-reference/napkin-api-*.md`
- Implementation under `src/**` (types, tools, server)

## Workflow

1) Source of truth
   - Prefer local API pages. Save as html on the browser, then let the agent convert it to `docs/mcp-reference/napkin-api-*.md`.
   - Do not invent fields or rename upstream snake_case identifiers.

2) Edit specs
   - Add or update a type: create `docs/specs/types/<kebab-case>.md` and link it from `docs/specs/types.md`.
   - Add or update a tool: create `docs/specs/tool-<name>.md` with TypeScript types, Zod schemas, and Notes.
   - Error model updates must stay consistent across: `docs/specs/error-model.md`, `src/errors.ts`, and `src/types/mcp-tool-error.ts`.

3) Sync implementation (if needed)
   - Update `src/types/*.ts` and export via `src/types/index.ts`.
   - Update `src/tools/*.ts` and tool registration in `src/index.ts`.

4) Validate locally
  - Type-check: `npm run check`
  - Build: `npm run build`
  - Docs via MCP resources: `npm run doc`
  - Lint (always run after implementation/updates): `npm run lint`
    - Review findings and decide remediation.
    - If fixes are appropriate, resolve them (prefer `npm run lint:fix` when safe).

5) Submit
   - Include links to the source you used, and to corresponding code changes.
   - Keep patches scoped and well-described.
   - Add a short "Lint Pass" note to the PR description:
     - Commands run (e.g., `npm run lint`, `npm run lint:fix`).
     - Types of fixes (type-only imports, Node env/globals for scripts, unused vars, removed unused directives).
     - Impact statement (no behavior change) and test status (`npm run test`).
   - Cross-doc sync: When updating any of `AGENTS.md`, `CLAUDE.md`, or `CONTRIBUTING.md`, mirror overlapping guidance and policy in the other files to keep them consistent.

## Writing Conventions

- Every spec file should include:
  - TypeScript types (minimal, readable)
  - Zod schemas (runtime validation, JSON Schema basis)
  - Notes (auth, URL expiry ~30 minutes, download/self-host guidance)
  - Test Cases (enumerated acceptance/negative/edge cases to validate behavior)
- Be explicit about defaults, ranges, and mutual exclusivity in both Zod and prose.

### Prompt & Instruction Style

- Use positive, imperative phrasing only (no negative forms). Example: "Use png for dimensions" instead of "Don't set width for non‑png".
- Keep prompts simple, clear, and specific. One idea per sentence.
- Use active voice and concrete verbs ("select", "validate", "return").
- State allowed values and ranges explicitly (avoid vague qualifiers or double negatives).
- Prefer short bullets over paragraphs for operational guidance.

### Specs and Tests
- When you add or change requirements in a spec, update the Test Cases section in that spec and mirror them with unit tests under `tests/**`.
- Preferred layout: domain folders (e.g., `tests/tools`, `tests/core`, `tests/data`, `tests/resources`, `tests/types`, `tests/meta`). Vitest auto-discovers `**/*.test.ts`.
- Run tests locally via `npm run test`. Keep tests focused and fast; mock network as needed (`global.fetch`, HTTP client).
- Error model changes must include mapping tests (HTTP error code, retriable, messages) and schema acceptance tests.

### Formatting Rules (data/code)
- Arrays in config/data files: place one element per line (easier diffs/reviews). Example: keep keyword lists like `src/data/visual-query-keywords.ts` as one item per line.
- Object keys in TS data maps: use double quotes consistently, even when identifiers wouldn't require them.
- Visual query keywords and style names should be English-only; docs may include localized notes, but generated query strings remain English.

## Implementation Notes
- HTTP client: `src/http.ts`
  - Timeout (default 20s), retries for 429/5xx (exponential backoff)
  - Auth: `Authorization: Bearer ${NAPKIN_API_KEY}`
- Error model: `src/errors.ts`
  - Maps Napkin HTTP errors to the spec's error codes
  - Tool results use `isError: true` and a structured `McpToolError` payload
- Types/Schemas (selected): `src/types/*`
  - `Format`, `Orientation`, `Bcp47String`, `Dimensions`, `GeneratedFile`, `StatusRequestEcho`, `McpToolError` etc.
  - Styles: `src/data/styles-catalog.ts` (internal), selector: `src/tools/styleSelector.ts`

## Source ↔ Tests Mapping
- This is the mapping of source files to test files.
- Update the mapping when you add or change a source file or test file, or when the src/test folder structure changes.
- See also `CLAUDE.md` and `CONTRIBUTING.md`.

`yaml
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
``r

## References

- Contributing guide: `CONTRIBUTING.md`
- Claude-specific playbook: `CLAUDE.md`
