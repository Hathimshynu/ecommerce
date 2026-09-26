import { describe, expect, it } from "vitest";
import { detectImageType, isImageRef } from "./uploads";

const bytes = (...parts: (number[] | string)[]) =>
  new Uint8Array(parts.flatMap((p) => (typeof p === "string" ? [...p].map((c) => c.charCodeAt(0)) : p)).concat(Array(16).fill(0)));

describe("detectImageType", () => {
  it("detects common image formats by magic bytes", () => {
    expect(detectImageType(bytes([0xff, 0xd8, 0xff, 0xe0]))).toBe("jpg");
    expect(detectImageType(bytes([0x89], "PNG"))).toBe("png");
    expect(detectImageType(bytes("GIF89a"))).toBe("gif");
    expect(detectImageType(bytes("RIFF", [0, 0, 0, 0], "WEBP"))).toBe("webp");
    expect(detectImageType(bytes([0, 0, 0, 0x20], "ftypavif"))).toBe("avif");
  });
  it("rejects non-images", () => {
    expect(detectImageType(bytes("<svg xmlns"))).toBeNull();
    expect(detectImageType(bytes("%PDF-1.7"))).toBeNull();
    expect(detectImageType(new Uint8Array(3))).toBeNull();
  });
});

describe("isImageRef", () => {
  it("accepts http(s) URLs and uploaded files only", () => {
    expect(isImageRef("https://cdn.example.com/a.jpg")).toBe(true);
    expect(isImageRef("/uploads/0f8fad5b-d9cb-469f-a165-70867728950e.webp")).toBe(true);
    expect(isImageRef("/uploads/../../etc/passwd")).toBe(false);
    expect(isImageRef("javascript:alert(1)")).toBe(false);
  });
});
