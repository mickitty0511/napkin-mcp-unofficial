import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import fs from "node:fs/promises";
import path from "node:path";

const DOCS_ROOT = path.resolve(process.cwd(), "docs");

async function listDocFiles(): Promise<string[]> {
  async function walk(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (ent) => {
        const res = path.resolve(dir, ent.name);
        if (ent.isDirectory()) return walk(res);
        return res;
      })
    );
    return files.flat();
  }
  try {
    const all = await walk(DOCS_ROOT);
    return all
      .filter((p) => p.endsWith(".md"))
      .map((abs) => path.relative(process.cwd(), abs).replaceAll("\\", "/"));
  } catch {
    return [];
  }
}

export async function registerDocsResources(server: McpServer): Promise<void> {
  const rels = await listDocFiles();
  for (const rel of rels) {
    const uri = `napkin-docs:///${rel}`; // triple slash so the full path is in pathname
    const name = `napkin-docs:${rel}`; // unique name per file
    server.registerResource(
      name,
      uri,
      {
        title: `Napkin Doc: ${rel}`,
        description: "Local documentation file exposed by the Napkin MCP server",
        mimeType: "text/markdown",
      },
      async (uriObj) => {
        const relFromUri = uriObj.pathname.replace(/^\/+/, ""); // strip leading '/'
        const abs = path.resolve(process.cwd(), relFromUri);
        if (!abs.startsWith(DOCS_ROOT)) {
          return { contents: [{ uri: uriObj.href, text: "Access denied" }] };
        }
        try {
          const text = await fs.readFile(abs, "utf8");
          return { contents: [{ uri: uriObj.href, text }] };
        } catch (e: any) {
          return { contents: [{ uri: uriObj.href, text: `Error reading file: ${e?.message ?? e}` }] };
        }
      }
    );
  }
}

