export class Node<Value> {
  constructor(public value: Value) {}
  public children: Node<Value>[] = [];
}

export class Graph<Value> {
  protected root: Node<Value>;

  constructor() {
    this.root = new Node(null);
  }

  protected find(predicate: (node: Node<Value>) => boolean) {
    return this.search(this.root, predicate);
  }

  protected search(
    node: Node<Value>,
    predicate: (node: Node<Value>) => boolean
  ): Node<Value> | null {
    if (predicate(node)) {
      return node;
    }

    for (const child of node.children) {
      const found = this.search(child, predicate);
      if (found) {
        return found;
      }
    }

    return null;
  }

  protected traverse(node: Node<Value>, callback: (node: Node<Value>) => void) {
    callback(node);
    node.children.forEach((child) => this.traverse(child, callback));
  }
}
