# Napkin API Documentation

> **Source:** https://api.napkin.ai/

Transform your text into beautiful, professional visuals with the Napkin API. Our powerful visual generation engine helps you create stunning diagrams, illustrations, and graphics programmatically from simple text descriptions.

## About Napkin

[Napkin](https://www.napkin.ai) is an AI-powered visual creation platform that helps you communicate ideas more effectively. With Napkin, you can instantly transform your text into engaging visuals, diagrams, and illustrations that make your content more memorable and impactful.

## Napkin API Developer Preview

**🔒 Invite-Only Access**: The Napkin API is currently in closed developer preview. Access is granted on an invitation basis to ensure we can provide the best experience and support to our early adopters.

The Napkin API brings the power of Napkin's visual generation engine to developers, enabling you to integrate automatic visual creation into your applications, workflows, and content pipelines. Whether you're building educational platforms, creating content automation tools, or enhancing documentation with dynamic visuals, our API makes it simple to generate professional graphics at scale.

### Key Features

- **🎨 Multiple Visual Styles**: Choose from 15 built-in professional styles or create custom styles to match your brand
- **🌍 Multi-language Support**: Generate visuals in any language using BCP 47 language tags
- **📐 Flexible Formats**: Export as scalable SVG, raster PNG, or PPT (PowerPoint).
- **🔄 Variation Generation**: Create up to 4 unique visual variations per request
- **🎯 Context-aware**: Add context before and after your main content for more meaningful visuals
- **⚡ Fast Processing**: Asynchronous processing with status polling for optimal performance
- **🔧 Customization Options**: Transparent backgrounds, color inversion, and dimension control

## Getting Started

### Get Your API Token

To use the Napkin API, you need an API token. Request yours by emailing: **[api@napkin.ai](mailto:api@napkin.ai)**

### Authentication

Include your token in all requests using the `Authorization` header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Rate Limits

- Rate limits are intentionally low during the developer preview. Contact [api@napkin.ai](mailto:api@napkin.ai) to request higher limits.
- Rate limit headers are included in responses
- Retry-After header indicates when to retry if limit is exceeded

### API Version

- **Current version**: 0.7.0
- All API responses include an `X-API-Version` header with the current version
- [View changelog →](/docs/changelog)

## API Workflow

The Napkin API uses a simple 3-step asynchronous workflow:

### 1️⃣ Create Visual Request

Submit your text content and preferences to generate visuals.

```
POST /v1/visual
```

[View endpoint documentation →](/api/create-visual-request)

### 2️⃣ Check Request Status

Poll the status endpoint until processing completes.

```
GET /v1/visual/{request-id}/status
```

[View endpoint documentation →](/api/get-visual-request-status)

### 3️⃣ Download Generated Files

Once completed, download your visual files using the URLs provided in the status response.

```
GET <file-url>
```

**Important Notes:**

- Complete download URLs are provided in the `generated_files` array from the status endpoint
- Authentication headers are required to download file content
- Files should be downloaded and hosted elsewhere for display - don't use these URLs directly in your application
- Both status and file URLs expire after 30 minutes from generation

[View endpoint documentation →](/api/download-visual-file)

## Available Styles

Choose from a comprehensive collection of visual styles to match your content and brand:

### Built-in Styles

Access 15 professionally designed styles across multiple categories:

- **Colorful Styles**: Vibrant and energetic designs for bold presentations
- **Casual Styles**: Relaxed and approachable visuals for informal content
- **Hand-drawn Styles**: Artistic, sketch-like appearance for creative projects
- **Formal Styles**: Professional and clean designs for business use
- **Monochrome Styles**: Minimalist black, white, and gray aesthetics

### Custom Styles

Create personalized styles that perfectly match your brand:

- Design custom color palettes and styling at [app.napkin.ai](https://app.napkin.ai)
- Copy your unique style ID for use in API requests
- **Note**: Custom fonts are not supported yet in PPT exports

[View all available styles with examples →](/docs/styles)

## Error Handling

The API returns standard HTTP status codes:

- `201` - Visual request created successfully
- `400` - Invalid request data
- `401` - Authentication required or invalid token
- `403` - Access denied to resource
- `404` - Resource not found
- `410` - Request has expired
- `429` - Rate limit exceeded
- `500` - Internal server error

## Best Practices

1. **Implement Exponential Backoff**: When polling for status, increase the interval between requests
2. **Handle Rate Limits**: Respect the rate limit headers and implement retry logic
3. **Cache Results**: Store generated visuals to avoid redundant API calls
4. **Use Appropriate Formats**: Choose SVG for scalability, PNG for specific dimensions
5. **Provide Context**: Use ~~`context_before` and `context_after`~~ `context` for better visual generation
6. **Language Tags**: Always specify the correct language for optimal results

## Support

- **Documentation Issues**: Report to [api@napkin.ai](mailto:api@napkin.ai)
- **API Access**: Request tokens at [api@napkin.ai](mailto:api@napkin.ai)
- **Technical Support**: Include your request ID when reporting issues

---

Ready to start creating amazing visuals? [Get your API token](mailto:api@napkin.ai) and explore the [API Reference](/api/create-visual-request) for detailed endpoint documentation, code examples, and request/response schemas.

Copyright © 2025 Napkin AI.