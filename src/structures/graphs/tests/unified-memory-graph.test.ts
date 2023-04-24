import { MemoryGraph, UnifiedMemoryGraph } from "..";

describe("UnifiedMemoryGraph", () => {
  function makeUnifiedMemoryGraph() {
    const unified = new UnifiedMemoryGraph();

    const one = new MemoryGraph();
    one.mark("a", "value");
    one.mark("b", "value_2");
    one.mark("c", "value_4");
    one.complete();

    const two = new MemoryGraph();
    two.mark("g", "value");
    two.mark("r", "value_2");
    two.mark("a", "value_3");
    two.mark("f", "value_4");
    two.complete();

    const three = new MemoryGraph();
    three.mark("d", "value");
    three.mark("a", "value_2");
    three.mark("n", "value_3");
    three.mark("e", "value_4");
    three.complete();

    const four = new MemoryGraph();
    four.mark("d", "value");
    four.mark("g", "value_2");
    four.mark("b", "value_3");
    four.mark("a", "value_4");
    four.complete();

    unified.merge(one);
    unified.merge(two);
    unified.merge(three);
    unified.merge(four);

    return unified;
  }

  describe("toJSON", () => {
    test("can convert to JSON", () => {
      const unified = makeUnifiedMemoryGraph();
      const json = unified.toJSON();
      expect(json).toMatchSnapshot();
    });
  });

  describe("importJSON", () => {
    test("can create instance from JSON representation", () => {
      const initial = makeUnifiedMemoryGraph();
      const json = initial.toJSON();
      const copy = new UnifiedMemoryGraph(json);
      expect(copy.toJSON()).toBe(json);
    });
  });
});
