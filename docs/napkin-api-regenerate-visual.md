# Regenerate visual (by id)

> Source: Same upstream endpoint (`POST /v1/visual`). This MCP repo documents regeneration separately for clarity.

Regenerate one or more existing visual layouts by `visual_id`/`visual_ids` while applying new content and options. The request is processed asynchronously.

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
    behavior: Output file format

  content:
    type: string
    required: true
    min_length: 1
    behavior: Main text content to render with the preserved layout(s)

  context:
    type: string
    required: false
    nullable: true
    behavior: Additional text context that improves generation but is not rendered

  language:
    type: string
    required: false
    format: BCP 47
    examples: [en, en-US, fr-FR, es-ES, de-DE, ja-JP]
    behavior: Interpret content language for labeling/locale

  style_id:
    type: string
    required: false
    nullable: true
    behavior: Style identifier; if omitted, server or tool may select a default

  visual_id:
    type: string
    required: false
    behavior: Regenerate a specific layout with new content (exact layout reuse)
    constraints:
      - Cannot be used when number_of_visuals > 1
      - Mutually exclusive with: visual_ids

  visual_ids:
    type: array
    items: string
    required: false
    behavior: Regenerate multiple specific layouts with new content (exact layout reuse)
    constraints:
      - Length must equal number_of_visuals
      - All IDs must be unique and non-empty
      - Mutually exclusive with: visual_id

  number_of_visuals:
    type: integer
    required: false
    default: 1
    min: 1
    max: 4
    behavior: How many outputs to produce; must match visual_ids length when provided

  transparent_background:
    type: boolean
    required: false
    default: false
    behavior: Use a transparent background (PNG only)

  inverted_color:
    type: boolean
    required: false
    default: false
    behavior: Invert colors for dark backgrounds

  width:
    type: integer
    required: false
    nullable: true
    min: 100
    max: 10000
    behavior: Target width in pixels for PNG conversion only (SVG scales naturally)
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
    behavior: Target height in pixels for PNG conversion only (SVG scales naturally)
    constraints:
      - Set only one of width or height
      - If both provided, width takes precedence and this value is ignored
      - The other dimension is computed to maintain aspect ratio

  orientation:
    type: string
    required: false
    allowed: [auto, horizontal, vertical, square]
    default: auto
    behavior: Orientation hint; may be overridden by layout constraints
```

## Notes

- Provide exactly one of `visual_id` or `visual_ids`.
- When both `width` and `height` are provided, `width` takes precedence; `height` is ignored.
- This page models the regeneration use case separately from Create for clarity.

