# Reusable Types (Index)

This is the index for reusable types and schemas. Each type now lives in its own spec for clarity and reuse.

- Format: docs/specs/types/format.md
- Orientation: docs/specs/types/orientation.md
- Bcp47String: docs/specs/types/bcp47-string.md
- VisualId: docs/specs/types/visual-id.md
- VisualSelection (and variants): docs/specs/types/visual-selection.md
- Dimensions: docs/specs/types/dimensions.md
- GeneratedFile: docs/specs/types/generated-file.md
- StatusRequestEcho: docs/specs/types/status-request-echo.md
- McpToolError: docs/specs/types/mcp-tool-error.md
- StylesCatalog (includes StyleId): docs/specs/types/styles-catalog.md

## AI-Assisted Development Artifact

### Step 1 (Documentation)
- Dependencies
  - TypeScript type system
  - Zod for runtime validation and JSON Schema emission
- Responsibilities
  - Define reusable enums (Format, Orientation) and primitives (Bcp47String)
  - Provide composite shapes (VisualSelection, Dimensions, GeneratedFile, StatusRequestEcho)
  - Centralize the error model (McpToolError)
- I/O
  - Input: none (declarative type definitions)
  - Output: importable types and schemas that other tool specs depend on
- Processing Flow
  1) Declare enums and primitive types
  2) Compose unions/objects for visual selection and dimensions
  3) Define response metadata shapes and request echo
  4) Provide error model with mapping-friendly codes

### Step 2 (Implementation Simulation)
This index routes consumers to per-type specs. Implementations import the specific type modules they need, keeping ownership and documentation close to each type definition.

### Step 3 (Consistency Check)
AI verdict: isGreen=true
message: The index cleanly links to per-type files; responsibilities and flow match the new split structure.
