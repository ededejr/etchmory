import { parseToken } from "..";

describe("parseToken", () => {
  test("can parse a token into a memory object", () => {
    const memory = parseToken("value_1:value_2:value_3");
    expect(memory).toBeDefined();
    expect(memory.recall("0")).toBe("value_1");
    expect(memory.recall("1")).toBe("value_2");
    expect(memory.recall("2")).toBe("value_3");
  });

  test("can coerce values into proper types", () => {
    const memory = parseToken("string:100:true:false");
    expect(memory).toBeDefined();
    expect(memory.recall("0")).toBe("string");
    expect(memory.recall("1")).toBe(100);
    expect(memory.recall("2")).toBe(true);
    expect(memory.recall("3")).toBe(false);
  });
});