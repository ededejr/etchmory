import { GraphMemory, UnifiedGraphMemory } from "..";

describe("UnifiedGraphMemory", () => {
  function makeUnifiedGraphMemory() {
    const unified = new UnifiedGraphMemory();

    const one = new GraphMemory();
    one.mark("a", "value");
    one.mark("b", "value_2");
    one.mark("c", "value_4");
    one.complete();

    const two = new GraphMemory();
    two.mark("g", "value");
    two.mark("r", "value_2");
    two.mark("a", "value_3");
    two.mark("f", "value_4");
    two.complete();

    const three = new GraphMemory();
    three.mark("d", "value");
    three.mark("a", "value_2");
    three.mark("n", "value_3");
    three.mark("e", "value_4");
    three.complete();

    const four = new GraphMemory();
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
      const unified = makeUnifiedGraphMemory();
      const json = unified.toJSON();
      expect(json).toMatchSnapshot();
    });
  });

  describe("importJSON", () => {
    test("can create instance from JSON representation", () => {
      const initial = makeUnifiedGraphMemory();
      const json = initial.toJSON();
      const copy = new UnifiedGraphMemory(json);
      expect(copy.toJSON()).toBe(json);
    });
  });
});
