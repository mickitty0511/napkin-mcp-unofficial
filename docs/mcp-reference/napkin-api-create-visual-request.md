# Create visual request

> **Source:** https://api.napkin.ai/api/create-visual-request

Create a new visual content generation request. The request will be processed asynchronously.

## Endpoint

```
POST /v1/visual
```

## Authentication

Include your Napkin API token in the `Authorization` header for every request.

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Parameters (YAML)

```yaml
parameters:
  format:
    type: string
    required: true
    allowed: [svg, png, ppt]
    behavior: Selects the output file format to generate for this request.

  content:
    type: string
    required: true
    min_length: 1
    behavior: Main text content to visualize; drives layout, shapes, and labels.

  context:
    type: string
    required: false
    nullable: true
    behavior: Additional text context related to the main content but not rendered; improves generation while keeping visuals clean.

  language:
    type: string
    required: false
    format: BCP 47
    examples: [en, en-US, fr-FR, es-ES, de-DE, ja-JP]
    behavior: Interprets content language to improve labeling and locale-sensitive output.
    notes:
      - Use BCP 47 subtag lookup when needed: https://r12a.github.io/app-subtags/

  style_id:
    type: string
    required: false
    nullable: true
    behavior: Style identifier to control look-and-feel; see Styles docs for available IDs. If omitted, a style may be selected automatically.

  visual_query:
    type: string
    required: false
    behavior: Search for a type of visual layout (e.g., "mindmap", "flowchart", "timeline"); may return different layouts of that type.
    constraints:
      - Cannot be used when number_of_visuals > 1
      - Mutually exclusive with: visual_queries, visual_id, visual_ids
      - May be ignored if the content is not eligible; API will select the best-fitting layout.

  visual_queries:
    type: array
    items: string
    required: false
    behavior: Search for multiple types of visual layouts; may return different layouts of those types.
    constraints:
      - Length must equal number_of_visuals
      - All entries must be unique and non-empty
      - Mutually exclusive with: visual_query, visual_id, visual_ids
      - May be ignored if the content is not eligible; API will select the best-fitting layouts.

  number_of_visuals:
    type: integer
    required: false
    default: 1
    min: 1
    max: 4
    behavior: How many visual variations to generate; increases processing time and output count.

  transparent_background:
    type: boolean
    required: false
    default: false
    behavior: Use a transparent background for generated output (primarily impacts PNG).

  inverted_color:
    type: boolean
    required: false
    default: false
    behavior: Invert colors for better contrast on dark backgrounds.

  width:
    type: integer
    required: false
    nullable: true
    min: 100
    max: 10000
    behavior: Target width in pixels for PNG conversion only (SVG scales naturally).
    constraints:
      - Set only one of width or height
      - If both provided, width takes precedence and height is ignored
      - The other dimension is computed to maintain aspect ratio

  height:
    type: integer
    required: false
    nullable: true
    min: 100
    max: 10000
    behavior: Target height in pixels for PNG conversion only (SVG scales naturally).
    constraints:
      - Set only one of width or height
      - If both provided, width takes precedence and this value is ignored
      - The other dimension is computed to maintain aspect ratio

  orientation:
    type: string
    required: false
    allowed: [auto, horizontal, vertical, square]
    default: auto
    behavior: Orientation hint for the generated visual.
    notes:
      - May take priority over visual_query/visual_queries if no layouts satisfy both the query and the requested orientation.
```

Note: The following fields are deprecated in the source and intentionally omitted: `context_before`, `context_after`.

## Example requests

Basic

```bash
curl -X POST https://api.napkin.ai/v1/visual \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "svg",
    "content": "Hello World",
    "language": "en-US",
    "number_of_visuals": 1
  }'
```

Advanced

```bash
curl -X POST https://api.napkin.ai/v1/visual \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "svg",
    "content": "Napkin API",
    "context": "This is for a tech company's API documentation",
    "language": "en-US",
    "style_id": "CDQPRVVJCSTPRBBCD5Q6AWR",
    "orientation": "auto",
    "transparent_background": true,
    "inverted_color": false,
    "number_of_visuals": 3,
    "width": 1200
  }'
```

## Responses

- 201 Created
  - Description: Visual request created successfully.
  - Body (shape):
    - `id`: string (uuid) 遯ｶ繝ｻRequest ID
    - `status`: string 遯ｶ繝ｻOne of `pending`, `completed`, `failed`
    - `request`: object 遯ｶ繝ｻEcho of request parameters (format, content, language, style_id, visual_id(s)/query(ies), transparent_background, inverted_color, number_of_visuals, orientation, width, height)
    - `generated_files`: array[object] 遯ｶ繝ｻPresent when completed; each file includes:
      - `url`: string (uri) 遯ｶ繝ｻDownload URL (expires after ~30 minutes and may require authentication headers)
      - `visual_id`: string 遯ｶ繝ｻVisual identifier used for this file (if applicable)
      - `visual_query`: string 遯ｶ繝ｻVisual query used (if applicable)
      - `style_id`: string 遯ｶ繝ｻActual style used
      - `width`: integer 遯ｶ繝ｻPixel width
      - `height`: integer 遯ｶ繝ｻPixel height

- 400 Bad Request
  - Description: Invalid request data. Includes `error` and `message`.

- 401 Unauthorized
  - Description: Authentication required or invalid token.

- 429 Too Many Requests
  - Description: Rate limit exceeded. Includes `limit`, `window`, `reset_time`, `retry_after`.

- 500 Internal Server Error
  - Description: Unexpected server error.

## Notes

- Only one of `visual_query` / `visual_queries` may be used in a single request.
- When both `width` and `height` are provided, `width` takes precedence; `height` is ignored.
- `orientation` can override query selection if necessary to satisfy constraints.

## See also

- Regenerate existing layout(s): `docs/mcp-reference/napkin-api-regenerate-visual.md`
