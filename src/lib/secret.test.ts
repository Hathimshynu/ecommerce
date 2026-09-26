import { describe, expect, it } from "vitest";
import { jwtSecretKey } from "./secret";

describe("jwtSecretKey", () => {
  it("rejects missing or short secrets", () => {
    expect(() => jwtSecretKey({})).toThrow();
    expect(() => jwtSecretKey({ JWT_SECRET: "short" })).toThrow();
  });
  it("rejects the example secret in production", () => {
    expect(() =>
      jwtSecretKey({ JWT_SECRET: "change-me-to-a-long-random-secret-string-of-32-chars-min", NODE_ENV: "production" }),
    ).toThrow(/example value/);
  });
  it("accepts a strong secret", () => {
    expect(jwtSecretKey({ JWT_SECRET: "x".repeat(40), NODE_ENV: "production" })).toBeInstanceOf(Uint8Array);
  });
});
