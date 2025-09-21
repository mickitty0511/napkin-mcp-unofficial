import { describe, it, expect } from "vitest";
import { FormatZ } from "../../src/types/format.js";
import { OrientationZ } from "../../src/types/orientation.js";
import { Bcp47Z } from "../../src/types/bcp47-string.js";
import { DimensionsZ } from "../../src/types/dimensions.js";
import { GeneratedFileZ } from "../../src/types/generated-file.js";
import { StatusRequestEchoZ } from "../../src/types/status-request-echo.js";
import { McpToolErrorZ } from "../../src/types/mcp-tool-error.js";
import { StyleIdZ } from "../../src/types/style-id.js";

describe("basic type schemas", () => {
  it("FormatZ", () => {
    expect(() => FormatZ.parse("svg")).not.toThrow();
    expect(() => FormatZ.parse("pdf")).toThrow();
  });

  it("OrientationZ", () => {
    expect(() => OrientationZ.parse("square")).not.toThrow();
    expect(() => OrientationZ.parse("diagonal")).toThrow();
  });

  it("Bcp47Z", () => {
    expect(() => Bcp47Z.parse("en-US")).not.toThrow();
    expect(() => Bcp47Z.parse("")).toThrow();
  });

  it("DimensionsZ", () => {
    expect(() => DimensionsZ.parse({ width: 100, height: null })).not.toThrow();
    expect(() => DimensionsZ.parse({ width: 99 })).toThrow();
  });

  it("GeneratedFileZ", () => {
    expect(() => GeneratedFileZ.parse({ url: "https://x/y" })).not.toThrow();
    expect(() => GeneratedFileZ.parse({ url: "not-url" })).toThrow();
  });

  it("StatusRequestEchoZ", () => {
    expect(() => StatusRequestEchoZ.parse({ context: null, number_of_visuals: 1 })).not.toThrow();
  });

  it("McpToolErrorZ", () => {
    expect(() => McpToolErrorZ.parse({ code: "BAD_REQUEST", message: "x", retriable: false })).not.toThrow();
    expect(() => McpToolErrorZ.parse({ code: "OOPS", message: "x" as any })).toThrow();
  });

  it("StyleIdZ", () => {
    expect(() => StyleIdZ.parse("ID123")).not.toThrow();
    expect(() => StyleIdZ.parse("")).toThrow();
  });
});
