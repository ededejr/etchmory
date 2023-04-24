import { MemoryObject } from "../memory-object";

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
      test("can mark a decision", () => {
        m.mark("decision", "value");
        m.mark("decision2", "value2");
        m.complete();
        expect(m.getToken().length).toBeGreaterThan(0);
      });

      test("can recall a decision", () => {
        m.mark("decision", "value");
        m.complete();
        expect(m.recall("decision")).toBe("value");
      });

      test("can replay an execution cycle", () => {
        m.mark("decision", "value");
        m.complete();
        const generator = m.replay();
        expect(generator.next().value).toEqual({
          key: "decision",
          value: "value",
        });
        expect(generator.next().done).toBe(true);
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
          "[Etchmory] Cannot complete an empty instance"
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
