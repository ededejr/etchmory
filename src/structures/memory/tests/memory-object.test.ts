import { MemoryObject } from "../memory-object";

describe("MemoryObject", () => {
  let onCompletionMock: jest.Mock;
  let generateTokenMock: jest.Mock;
  let m: TestableMemoryObject;

  class TestableMemoryObject extends MemoryObject {
    private $size = 0;

    public get size() {
      return this.$size;
    }

    protected generateToken() {
      generateTokenMock();
      return "";
    }

    public mark() {
      this.$size++;
    }

    public recall() {
      return "";
    }
    public replay() {
      return {} as any;
    }
    protected onCompletion() {
      onCompletionMock();
    }
  }

  beforeEach(() => {
    onCompletionMock = jest.fn();
    generateTokenMock = jest.fn();
    m = new TestableMemoryObject();
  });

  test("calls onCompletion when complete is called", () => {
    m.mark();
    m.complete();
    expect(onCompletionMock).toHaveBeenCalled();
  });

  test("calls generateToken when getToken is called", () => {
    m.mark();
    m.complete();
    m.getToken();
    expect(generateTokenMock).toHaveBeenCalled();
  });

  test("cannot complete with no decisions", () => {
    expect(() => m.complete()).toThrowError(
      "[Etchmory] Cannot complete due to instance not having any marked decisions. Please ensure mark() is called before complete()."
    );
  });
});

export function testMemoryObjectCompliance(
  name: string,
  createObject: () => MemoryObject
) {
  describe(`${name}: MemoryObject Compliance`, () => {
    let m: MemoryObject;

    beforeEach(() => {
      m = createObject();
    });

    describe("implements correct method signatures", () => {
      test("should have a mark method", () => {
        expect(m.mark).toBeInstanceOf(Function);
      });

      test("should have a recall method", () => {
        expect(m.recall).toBeInstanceOf(Function);
      });

      test("should have a replay method", () => {
        expect(m.replay).toBeInstanceOf(Function);
      });

      test("should have a complete method", () => {
        expect(m.complete).toBeInstanceOf(Function);
      });

      test("should have a getToken method", () => {
        expect(m.getToken).toBeInstanceOf(Function);
      });
    });

    describe("meets implementation requirements", () => {
      describe("mark", () => {
        test("can mark decision", () => {
          m.mark("decision", "value");
          m.mark("decision_2", "value");
          m.complete();
          expect(m.getToken().length).toBeGreaterThan(0);
        });

        test("increments length", () => {
          m.mark("decision", "value");
          expect(m.size).toBe(1);
          m.mark("decision_2", "value");
          expect(m.size).toBe(2);
        });

        test("prevents multiple decisions with the same key", () => {
          m.mark("decision", "value");
          expect(() => m.mark("decision", "value_2")).toThrowError(
            'Decision "decision" already exists'
          );
        });
      });

      describe("recall", () => {
        test("can recall decision", () => {
          m.mark("decision", "value");
          m.complete();
          expect(m.recall("decision")).toBe("value");
        });

        test("can recall numbers", () => {
          m.mark("decision", 1);
          m.complete();
          expect(m.recall("decision")).toBe(1);
        });

        test("can recall booleans", () => {
          m.mark("decision", true);
          m.complete();
          expect(m.recall("decision")).toBe(true);
        });

        test("throws error if decision does not exist", () => {
          m.mark("decision", "value");
          m.complete();
          expect(() => m.recall("decision_2")).toThrowError(
            'Decision "decision_2" does not exist'
          );
        });
      });

      describe("replay", () => {
        test("can replay decisions", () => {
          m.mark("decision", "value");
          m.mark("decision_2", "value_2");
          m.complete();
          const iterator = m.replay();
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

        test("returns iterator", () => {
          m.mark("decision", "value");
          m.complete();
          const iterator = m.replay();
          expect(iterator.next).toBeInstanceOf(Function);
        });
      });

      test("can generate a token", () => {
        m.mark("decision", "value");
        m.complete();
        const token = m.getToken();
        expect(typeof token).toBe("string");
        expect(token.length).toBeGreaterThan(0);
      });
    });

    describe("implements correct method guards", () => {
      test("should fail if mark is called after complete", () => {
        m.mark("one", "value");
        m.complete();
        expect(() => m.mark("decision", "value")).toThrowError(
          "[Etchmory] Cannot perform action on inactive instance. Please perform this action before calling complete()"
        );
      });

      test("should fail if recall is called before complete", () => {
        m.mark("decision", "value");
        expect(() => m.recall("decision")).toThrowError(
          "[Etchmory] Cannot perform action on active instance. Did you forget to call complete()?"
        );
      });

      test("should fail if replay is called before complete", () => {
        m.mark("decision", "value");
        expect(() => m.replay()).toThrowError(
          "[Etchmory] Cannot perform action on active instance. Did you forget to call complete()?"
        );
      });

      test("should fail if getToken is called before complete", () => {
        m.mark("decision", "value");
        expect(() => m.getToken()).toThrowError(
          "[Etchmory] Cannot perform action on active instance. Did you forget to call complete()?"
        );
      });

      test("should fail if complete is called with size being 0", () => {
        expect(() => m.complete()).toThrowError(
          "[Etchmory] Cannot complete due to instance not having any marked decisions. Please ensure mark() is called before complete()."
        );
      });

      test("should be no-op if complete is called twice", () => {
        m.mark("decision", "value");
        m.complete();
        expect(() => m.complete()).not.toThrowError();
      });
    });
  });
}
