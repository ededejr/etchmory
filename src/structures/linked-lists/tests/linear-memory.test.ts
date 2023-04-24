import { testMemoryObjectCompliance } from "../../memory/tests/memory-object.test";
import { LinearMemory } from "../linear-memory";

describe("LinearMemory", () => {
  let memory: LinearMemory;

  beforeEach(() => {
    memory = new LinearMemory();
  });

  testMemoryObjectCompliance("LinearMemory", () => new LinearMemory());

  test("should generate a token with lm:: prefix", () => {
    memory.mark("decision", "value");
    memory.complete();
    const token = memory.getToken();
    expect(token.startsWith("lm::")).toBe(true);
  });
});
