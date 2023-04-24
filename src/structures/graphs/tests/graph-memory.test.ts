import { GraphMemory } from "..";
import { testMemoryObjectCompliance } from "../../memory/tests/memory-object.test";

describe("GraphMemory", () => {
  testMemoryObjectCompliance("GraphMemory", () => new GraphMemory());
});
