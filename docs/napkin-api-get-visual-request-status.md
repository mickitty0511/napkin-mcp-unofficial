# Get visual request status

> **Source:** https://api.napkin.ai/api/get-visual-request-status

Retrieve the current status and details of a visual request.

## Endpoint

```
GET /v1/visual/{request-id}/status
```

## Authentication

Include your Napkin API token in the `Authorization` header for every request.

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Parameters (YAML)

```yaml
parameters:
  path:
    request-id:
      type: string
      format: uuid
      required: true
      behavior: Unique identifier of the visual request to query.
```

## Status values

- pending: Request is queued for processing
- completed: Processing finished successfully; files are available
- failed: Processing failed due to an error

Important: Status and file URLs expire ~30 minutes after generation.

## Example

```bash
curl https://api.napkin.ai/v1/visual/d1f2b3a4-c5d6-e7f8-g9h0-i1j2k3l4m5n6/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 200 OK — Response body

- id: string (uuid) — Unique identifier of the request
- status: string — One of `pending`, `completed`, `failed`
- request: object — Request details and parameters (format, context, content, language, style_id, visual_id/visual_ids/visual_query/visual_queries, transparent_background, inverted_color, number_of_visuals, orientation, width, height)
- generated_files: array[object] — Present when status is `completed`; each item includes:
  - url: string (uri) — Download URL (expires after ~30 minutes; may require authentication headers)
  - visual_id: string — Visual identifier used for this file (if applicable)
  - visual_query: string — Visual query used for this file (if applicable)
  - style_id: string — Actual style used
  - width: integer — Pixel width
  - height: integer — Pixel height

### Example responses

Pending

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "pending",
  "request": {
    "format": "svg",
    "language": "en-US",
    "content": "Hello World",
    "transparent_background": false,
    "inverted_color": false,
    "number_of_visuals": 1
  }
}
```

Completed (with visual_query)

```json
{
  "id": "44de9c98-5240-4d53-bded-989164175c9c",
  "status": "completed",
  "request": {
    "format": "png",
    "language": "fr-FR",
    "style_id": "formal-light",
    "visual_query": "mindmap",
    "transparent_background": true,
    "inverted_color": true,
    "number_of_visuals": 1,
    "width": 10000
  },
  "generated_files": [
    {
      "url": "https://api.napkin.ai/v1/visual/44de9c98-5240-4d53-bded-989164175c9c/file/71341ead-774d-4d17-beb5-e5b71fb7a1f4_c",
      "visual_id": "5OPCVNNXELCHPDHCCTP42ANBSOJWWATQ",
      "visual_query": "mindmap",
      "style_id": "CSQQ4VB1DGPPRTB7D1T0",
      "width": 10000,
      "height": 6086
    }
  ]
}
```

## Errors

- 400 Invalid request ID format
- 401 Authentication required or invalid token
- 403 Access denied — request belongs to another user
- 404 Request not found
- 410 Request has expired and is no longer available
- 500 Internal server error
