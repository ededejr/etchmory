import { MemoryGraph } from "..";

describe("MemoryGraph", () => {
  describe("mark", () => {
    test("can mark decision", () => {
      const graph = new MemoryGraph();
      graph.mark("decision", "value");
      expect(graph.length).toBe(1);
      graph.mark("decision_2", "value");
      expect(graph.length).toBe(2);
    });

    test("increments length", () => {
      const graph = new MemoryGraph();
      graph.mark("decision", "value");
      expect(graph.length).toBe(1);
      graph.mark("decision_2", "value");
      expect(graph.length).toBe(2);
    });
  });

  describe("recall", () => {
    test("can recall decision", () => {
      const graph = new MemoryGraph();
      graph.mark("decision", "value");
      graph.complete();
      expect(graph.recall("decision")).toBe("value");
    });

    test("can recall numbers", () => {
      const graph = new MemoryGraph();
      graph.mark("decision", 1);
      graph.complete();
      expect(graph.recall("decision")).toBe(1);
    });

    test("can recall booleans", () => {
      const graph = new MemoryGraph();
      graph.mark("decision", true);
      graph.complete();
      expect(graph.recall("decision")).toBe(true);
    });

    test("throws error if decision does not exist", () => {
      const graph = new MemoryGraph();
      graph.mark("decision", "value");
      graph.complete();
      expect(() => graph.recall("decision_2")).toThrowError(
        'Decision "decision_2" does not exist'
      );
    });
  });

  describe("replay", () => {
    test("can replay decisions", () => {
      const graph = new MemoryGraph();
      graph.mark("decision", "value");
      graph.mark("decision_2", "value_2");
      graph.complete();
      const iterator = graph.replay();
      expect(iterator.next().value).toEqual({
        key: "decision",
        value: "value",
      });
      expect(iterator.next().value).toEqual({
        key: "decision_2",
        value: "value_2",
      });
      expect(iterator.next().done).toBe(true);
    });
  });

  describe("complete", () => {
    test("can complete", () => {
      const graph = new MemoryGraph();
      graph.mark("decision", "value");
      graph.mark("decision_2", "value_2");
      graph.complete();
      expect(graph.length).toBe(2);
    });

    test("cannot complete with no decisions", () => {
      const graph = new MemoryGraph();
      expect(() => graph.complete()).toThrowError(
        "Cannot complete due to instance not having any marked decisions. Please ensure mark() is called before complete()."
      );
    });
  });

  describe("throws invalid use errors", () => {
    test("throws error if mark is called after complete", () => {
      const memory = new MemoryGraph();
      memory.mark("decision_1", "value_1");
      memory.mark("decision_2", "value_2");
      memory.complete();
      expect(() => memory.mark("decision_3", "value_3")).toThrowError(
        "[Etchmory] Cannot mark due to instance not being in the active state. Please ensure complete() is not called before marking."
      );
    });

    test("throws error if recall is called before complete", () => {
      const memory = new MemoryGraph();
      memory.mark("decision_1", "value_1");
      memory.mark("decision_2", "value_2");
      expect(() => memory.recall("decision_1")).toThrowError(
        "[Etchmory] Instance must be completed before a repeatable value can be guaranteed during recall. Please ensure complete() is called before recalling."
      );
    });

    test("throws error if replay is called before complete", () => {
      const memory = new MemoryGraph();
      memory.mark("decision_1", "value_1");
      memory.mark("decision_2", "value_2");
      expect(() => memory.replay()).toThrowError(
        "[Etchmory] Cannot replay due to instance not being in the active state. Please ensure complete() has been called."
      );
    });
  });
});
