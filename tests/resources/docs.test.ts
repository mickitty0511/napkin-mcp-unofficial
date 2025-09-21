import { describe, it, expect } from "vitest";
import { registerDocsResources } from "../../src/resources/docs.js";

describe("registerDocsResources", () => {
  it("registers markdown files and serves contents; denies outside access", async () => {
    const registered: Array<{ name: string; uri: string; handler: (u: URL) => any }> = [];
    const fakeServer = {
      registerResource(name: string, uri: string, _meta: any, handler: (u: URL) => any) {
        registered.push({ name, uri, handler });
      },
    } as any;
    await registerDocsResources(fakeServer);
    expect(registered.length).toBeGreaterThan(0);
    // pick first md resource
    const { uri, handler } = registered[0];
    const ok = await handler(new URL(uri));
    expect(ok.contents?.[0]?.text).toMatch(/# /); // markdown title present

    const denied = await handler(new URL("napkin-docs:////etc/passwd"));
    expect(denied.contents?.[0]?.text).toMatch(/Access denied/);
  });
});
