import { describe, it, expect } from "vitest";
import { robotsQuerySchema } from "@/lib/validators/robots";

describe("basic math", () => {
  it("should work", () => {
    expect(1 + 1).toBe(2);
  });
});

describe("path aliases", () => {
  it("resolves @/ imports", () => {
    expect(robotsQuerySchema).toBeDefined();
  });
});