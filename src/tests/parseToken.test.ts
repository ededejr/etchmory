import { parseToken } from "..";

describe("parseToken", () => {
  test("can parse a token into a memory object", () => {
    const memory = parseToken("value_1:value_2:value_3");
    expect(memory).toBeDefined();
    expect(memory.get("0")).toBe("value_1");
    expect(memory.get("1")).toBe("value_2");
    expect(memory.get("2")).toBe("value_3");
  });
});