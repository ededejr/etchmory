export class GraphNode<Value> {
  constructor(public value: Value) {}
  public children: GraphNode<Value>[] = [];
}

export class Graph<Value> {
  protected root: GraphNode<Value>;

  constructor() {
    this.root = new GraphNode(null);
  }

  protected find(predicate: (node: GraphNode<Value>) => boolean) {
    return this.search(this.root, predicate);
  }

  protected search(
    node: GraphNode<Value>,
    predicate: (node: GraphNode<Value>) => boolean
  ): GraphNode<Value> | null {
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

  protected traverse(
    node: GraphNode<Value>,
    callback: (node: GraphNode<Value>) => void
  ) {
    callback(node);
    node.children.forEach((child) => this.traverse(child, callback));
  }
}
