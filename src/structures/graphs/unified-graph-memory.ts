import { GraphMemory } from "./graph-memory";
import { Decision } from "../../types";
import { throwError } from "../../utils";
import { Graph, GraphNode } from "./graph";
import { MemoryGraphNode } from "./graph-memory";

/**
 * Combines multiple GraphMemory instances into a single graph where all decisions
 * are unique at the order in which they are made. The graph structure is
 * representative of possible paths through the execution cycle.
 *
 * The graph is a tree structure where each node represents a decision and its
 * value. The root node is the start of the execution cycle and a leaf node
 * is the end of the execution cycle.
 */
export class UnifiedGraphMemory extends Graph<Decision> {
  constructor(json?: string) {
    super();
    if (json) {
      this.importJSON(json);
    }
  }

  /**
   * Merge a GraphMemory instance into this UnifiedGraphMemory.
   */
  public merge(graph: GraphMemory) {
    const sequence = graph.replay();

    let current: MemoryGraphNode = this.root;

    while (true) {
      const { value: decision, done } = sequence.next();

      if (done) {
        break;
      }

      const existing = current.children.find(
        (child) =>
          child.value.key === decision.key &&
          child.value.value === decision.value
      );

      if (existing) {
        current = existing;
      } else {
        const node = new GraphNode(decision);
        current.children.push(node);
        current = node;
      }
    }
  }

  /**
   * Get a pretty formatted string representing the graph.
   */
  public display(hideValues = true) {
    let output = "";

    const printNode = (node: MemoryGraphNode, depth: number) => {
      const indent = "  ".repeat(depth);
      const valueString = node.value
        ? `${node.value.key}${hideValues ? "" : ` = ${node.value.value}`}`
        : "⏺";

      output += `\n${indent}${valueString}`;

      for (const child of node.children) {
        printNode(child, depth + 1);
      }
    };

    printNode(this.root, 0);

    return output;
  }

  /**
   * Get a JSON representation of the graph.
   */
  public toJSON() {
    return JSON.stringify({
      root: this.root,
    });
  }

  /**
   * Import a JSON representation of the graph.
   */
  private importJSON(json: string) {
    if (this.root.children.length > 0) {
      throwError(
        new Error(
          "Cannot load JSON due to instance already having decisions. Please ensure loadJSON() is called before merge()."
        )
      );
    }

    const parsed: UnifiedGraphMemoryJSON = JSON.parse(json);

    const loadNode = (mgn: MemoryGraphNode) => {
      const node = new GraphNode(mgn.value);
      node.children = node.children.map((child) => loadNode(child));
      return node;
    };

    loadNode(parsed.root);
    this.root = parsed.root;
  }
}

interface UnifiedGraphMemoryJSON {
  [key: string]: GraphNode<Decision>;
}
