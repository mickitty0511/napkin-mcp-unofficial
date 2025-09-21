# Contributing to Napkin AI MCP Unofficial

This directory holds the split specifications for the Napkin MCP toolset. Please follow these guidelines when adding or changing spec files to keep docs and code in sync.

## Scope & Principles

- Single source of truth: keep specs aligned with the implementation.
- Preserve upstream naming and behavior: snake_case field names, defaults, constraints, and mutual exclusivity.
- Exclude deprecated fields (e.g., `context_before`, `context_after`).

## File Layout & Naming

- Types: `docs/specs/types/*.md` (e.g., `types/format.md`). H1 should be `Type: <Name>`.
- Tools: `docs/specs/tool-*.md` (e.g., `tool-create-visual-request.md`). H1 should be `Tool: <tool_name>`.
- Error model: `docs/specs/error-model.md`.
- Indexes: `docs/specs/types.md` and `docs/specs/README.md` (this folder index).
- Reference sources: `docs/napkin-api-*.md`.

## Section Style

- TypeScript types: minimal, readable TS interfaces/types.
- Zod schemas: runtime validation and basis for JSON Schema exposure.
- Notes: critical operational details (URL expiry ~30 minutes, Authorization header required, avoid hotlinking, etc.).

## How to Add or Update

1) Add or update a Type
   - Create/update `docs/specs/types/<kebab-case>.md` with H1 `Type: <PascalCase>`.
   - Include Zod/TS definitions and link it from `docs/specs/types.md`.
   - If code needs the type, update `src/types/*.ts` and export from `src/types/index.ts`.

2) Add or update a Tool
   - Create/update `docs/specs/tool-<name>.md` with TS/Zod/Notes sections.
   - Update `src/tools/*.ts` as needed and keep `src/index.ts` tool registration and input/output schemas in sync.
   - Add or update a `## Test Cases` section in the spec and mirror those in unit tests under `tests/tools/*`.

3) Change the Error Model
   - Keep `docs/specs/error-model.md`, `src/errors.ts`, and `src/types/mcp-tool-error.ts` consistent (codes, shapes, behavior).
   - Update tests in `tests/core/*` to cover mapping (status→code, retriable, messages) and schema validation.

4) Update Indexes
   - Add new files to the Spec Index in `docs/specs/README.md` and to `docs/specs/types.md` as appropriate.

## Validation (Local)

- Type-check: `npm run check`
- Build: `npm run build`
- Docs via MCP resources: `npm run doc`
  - Ensure the first 60 lines render and the new file is readable via `napkin-docs:///docs/...`.
 - Lint: Always run after implementation/updates: `npm run lint`.
   - Review lint findings and decide remediation.
   - If fixes are appropriate, resolve them (use `npm run lint:fix` when safe) to keep style and imports consistent.
 - Tests: `npm run test` (Vitest). If you changed specs or behavior, update/add tests to reflect the spec's `## Test Cases`.

## Writing Tips

- Be concise and specific; keep examples and caveats in the Notes section.
- Reflect defaults, ranges, and mutual exclusivity in Zod and also state them in prose.
- Use upstream snake_case field names verbatim; avoid local renames.
- Always reiterate authentication, URL expiry, and download/self-host guidance where relevant.

### Prompt/Instruction Style

- Use positive, imperative phrasing only (禁止: 否定形). 例: 「PNG のときに width を指定する」(良) / 「PNG 以外では width を指定しない」(不可)。
- シンプル・明確・具体的に。短い文で一意に理解できるように書く。
- 可能な限り能動態を使う（例: 「検証する」「返す」「選択する」）。
- 許容値・既定値・範囲を明示する（曖昧語や二重否定を避ける）。

### Formatting & Data Conventions
- Arrays in config/data files: place one element per line for readability and clean diffs (e.g., keyword lists in `src/data/visual-query-keywords.ts`).
- Object keys in TS data maps: use double quotes consistently, even when the key would be a valid identifier without quotes.
- Visual query keywords and style names should be English-only; generated values for `visual_query` / `visual_queries` and `style_id` mapping must use English terms. Localized commentary can appear in docs, but not in emitted query strings.

## Tests Layout

- Place tests under `tests/**` and group by domain: `tools/`, `core/` (HTTP client, error mapping), `data/`, `resources/`, `types/`, `meta/`.
- Prefer unit tests with mocks over end-to-end calls. Mock `global.fetch` for HTTP and keep retries/backoff fast.
- Keep spec and tests in sync by updating each spec's `## Test Cases` section alongside code and tests.

### Source ↔ Tests Mapping (required to keep updated!!)
- This is the mapping of source files to test files.
- Update the mapping when you add or change a source file or test file, or when the src/test folder structure changes.
- See `CLAUDE.md` for the latest mapping.

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

## PR Checklist

- Cite the source you used (e.g., `docs/napkin-api-*.md`).
- Link to corresponding code changes (types/schemas/tool registration) when applicable.
- Update indexes and verify `npm run check` / `npm run build` / `npm run doc` all pass locally.
- Run `npm run lint`; fix lint errors where appropriate (or include justification for exceptions).
- Add a short "Lint Pass" section to the PR description:
  - Commands run and whether `lint:fix` was used.
  - Types of fixes (type-only imports, env/globals in scripts, unused vars, removed unused eslint directives).
  - Impact statement (no behavior change) and test status (`npm run test`).
 - Cross-doc sync: When editing any of `AGENTS.md`, `CLAUDE.md`, or `CONTRIBUTING.md`, update the other files with the same policy/guidance so the three remain consistent.
