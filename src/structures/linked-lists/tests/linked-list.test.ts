import { LinkedList } from "../linked-list";

describe("LinkedList", () => {
  let list: LinkedList<number>;

  beforeEach(() => {
    list = new LinkedList<number>();
    list.add(1);
    list.add(2);
    list.add(3);
    list.add(4);
    list.add(5);
  });

  test("should add values to the list", () => {
    list.add(6);
    expect(list.length).toBe(6);
  });

  test("should traverse the list", () => {
    const values: number[] = [];
    list.traverse((value) => values.push(value));
    expect(values).toEqual([1, 2, 3, 4, 5]);
  });

  test("should find a value in the list", () => {
    const node = list.find((v) => v === 3);
    expect(node!.value).toBe(3);
  });

  test("should return null if the value is not found", () => {
    const node = list.find((v) => v === 6);
    expect(node).toBeNull();
  });

  test("preserves links of the list", () => {
    const node = list.find((v) => v === 3);
    expect(node!.value).toBe(3);
    expect(node!.previous!.value).toBe(2);
    expect(node!.next!.value).toBe(4);
  });
});
