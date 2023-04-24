class Node<Value> {
  value: Value;
  next: Node<Value> | null;
  previous: Node<Value> | null;

  constructor(value: Value) {
    this.value = value;
    this.next = null;
    this.previous = null;
  }
}

/**
 * An implementation for a doubly linked list which supports
 * adding values to the end of the list, traversing the list and
 * finding a value in the list.
 */
export class LinkedList<Value> {
  protected head: Node<Value> | null;
  protected tail: Node<Value> | null;
  private size: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  get length() {
    return this.size;
  }

  public add(value: Value) {
    const node = new Node(value);

    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail!.next = node;
      node.previous = this.tail;
      this.tail = node;
    }

    this.size++;
  }

  public traverse(fn: (value: Value) => void) {
    let current = this.head;

    while (current !== null) {
      fn(current.value);
      current = current.next;
    }
  }

  public find(value: Value) {
    let current = this.head;

    while (current !== null) {
      if (current.value === value) {
        return current;
      }

      current = current.next;
    }

    return null;
  }
}
