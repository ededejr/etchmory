import * as Etchmory from "..";

describe("Etchmory", () => {
  test("exports LinearMemory", () => {
    expect(Etchmory.LinearMemory).toBeDefined();
  });

  test("exports GraphMemory", () => {
    expect(Etchmory.GraphMemory).toBeDefined();
  });

  test("exports UnifiedGraphMemory", () => {
    expect(Etchmory.UnifiedGraphMemory).toBeDefined();
  });

  test("contains no other exports", () => {
    expect(Object.keys(Etchmory).length).toBe(3);
  });
});
