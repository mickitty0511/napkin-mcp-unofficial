import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { NapkinHttpClient } from "./http.js";
import { mapErrorToMcpToolError } from "./errors.js";
import { CreateVisualInputZ, CreateVisualInputShape, CreateVisualOutputZ, createVisual } from "./tools/createVisual.js";
import { StatusInputZ, GetStatusOutputZ, getStatus } from "./tools/getStatus.js";
import { DownloadInputZ, DownloadOutputZ, buildDownloadAdvice } from "./tools/downloadFile.js";
import { RegenerateVisualInputZ, RegenerateVisualInputShape, RegenerateVisualOutputZ, regenerateVisual } from "./tools/regenerateVisual.js";
import { registerDocsResources } from "./resources/docs.js";
import { INSTRUCTIONS } from "./instructions.js";

const server = new McpServer(
  { name: "napkin-mcp-server-unofficial", version: "0.1.0" },
  { instructions: INSTRUCTIONS }
);

// Tool: Create Visual Request
server.registerTool(
  "napkin_create_visual_request",
  {
    title: "Create Visual Request",
    description: "Create a new visual generation request (POST /v1/visual)",
    inputSchema: CreateVisualInputShape,
    outputSchema: CreateVisualOutputZ.shape,
  },
  async (args, _extra) => {
    try {
      const client = new NapkinHttpClient();
      const input = CreateVisualInputZ.parse(args);
      const out = await createVisual(client, input);
      return { content: [], structuredContent: out };
    } catch (err) {
      const toolErr = mapErrorToMcpToolError(err);
      return {
        isError: true,
        content: [{ type: "text", text: `${toolErr.code}: ${toolErr.message}` }],
        structuredContent: toolErr as any,
      };
    }
  }
);

// Tool: Regenerate Visual (by id or ids)
server.registerTool(
  "napkin_regenerate_visual",
  {
    title: "Regenerate Visual",
    description: "Regenerate existing layout(s) using visual_id or visual_ids (POST /v1/visual)",
    inputSchema: RegenerateVisualInputShape,
    outputSchema: RegenerateVisualOutputZ.shape,
  },
  async (args, _extra) => {
    try {
      const client = new NapkinHttpClient();
      const input = RegenerateVisualInputZ.parse(args);
      const out = await regenerateVisual(client, input);
      return { content: [], structuredContent: out };
    } catch (err) {
      const toolErr = mapErrorToMcpToolError(err);
      return {
        isError: true,
        content: [{ type: "text", text: `${toolErr.code}: ${toolErr.message}` }],
        structuredContent: toolErr as any,
      };
    }
  }
);

// Tool: Get Visual Status
server.registerTool(
  "napkin_get_visual_status",
  {
    title: "Get Visual Status",
    description: "Retrieve generation status (GET /v1/visual/{id}/status)",
    inputSchema: StatusInputZ.shape,
    outputSchema: GetStatusOutputZ.shape,
  },
  async (args, _extra) => {
    try {
      const client = new NapkinHttpClient();
      const input = StatusInputZ.parse(args);
      const out = await getStatus(client, input);
      return { content: [], structuredContent: out };
    } catch (err) {
      const toolErr = mapErrorToMcpToolError(err);
      return {
        isError: true,
        content: [{ type: "text", text: `${toolErr.code}: ${toolErr.message}` }],
        structuredContent: toolErr as any,
      };
    }
  }
);

// Tool: Download Visual File (advisory only)
server.registerTool(
  "napkin_download_visual_file",
  {
    title: "Download Visual File (advisory)",
    description:
      "Return download guidance and required headers for a generated file (no binary content)",
    inputSchema: {
      downloadUrl: z.string().url().optional(),
      requestId: z.string().uuid().optional(),
      fileId: z.string().min(1).optional(),
    },
    outputSchema: DownloadOutputZ.shape,
  },
  async (args, _extra) => {
    try {
      const input = DownloadInputZ.parse(args);
      const out = buildDownloadAdvice(input);
      return { content: [], structuredContent: out };
    } catch (err) {
      const toolErr = mapErrorToMcpToolError(err);
      return {
        isError: true,
        content: [{ type: "text", text: `${toolErr.code}: ${toolErr.message}` }],
        structuredContent: toolErr as any,
      };
    }
  }
);

// Docs as resources are managed in src/resources/docs.ts

// Start stdio transport if this module is run directly
async function start() {
  await registerDocsResources(server);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

start().catch((err) => {
  console.error("Failed to start napkin-mcp-server-unofficial:", err);
  process.exit(1);
});
