import { Decision, SourceValue } from "../../types";
import { throwError } from "../../utils";
import { GraphNode, Graph } from "./graph";

export type MemoryGraphNode = GraphNode<Decision>;

/**
 * MemoryGraph is a graph that tracks decisions made during an execution cycle.
 * It is used to store the results of decisions made during an execution cycle
 * and to replay them in the order they were made.
 *
 * The graph is a tree structure where each node represents a decision and its
 * value. The root node is the start of the execution cycle and the leaf node
 * is the end of the execution cycle.
 *
 * Atypically all nodes have a single child node indicating the next decision
 * made during the execution cycle.
 */
export class MemoryGraph extends Graph<Decision> {
  public length = 0;
  private current: MemoryGraphNode;
  private isRunning = true;

  constructor() {
    super();
    this.current = this.root;
  }

  public mark(decision: string, value: SourceValue) {
    if (!this.isRunning) {
      throwError(
        new Error(
          "Cannot mark due to instance not being in the active state. Please ensure complete() is not called before marking."
        )
      );
    }

    const node = new GraphNode({ key: decision, value });
    this.current.children.push(node);
    this.current = node;
    this.length++;
  }

  public recall(decision: string) {
    if (this.isRunning) {
      throwError(
        new Error(
          "Instance must be completed before a repeatable value can be guaranteed during recall. Please ensure complete() is called before recalling."
        )
      );
    }

    const node = this.find((node) => node.value?.key === decision);
    if (!node) {
      throw new Error(`Decision "${decision}" does not exist`);
    }
    return node.value.value;
  }

  public replay(): Iterator<Decision> {
    if (this.isRunning) {
      throwError(
        new Error(
          "Cannot replay due to instance not being in the active state. Please ensure complete() has been called."
        )
      );
    }

    let generator = function* generator() {
      let current: MemoryGraphNode = this.root;

      while (current.children.length > 0) {
        const next = current.children[0];
        yield next.value;
        current = next;
      }
    };

    generator = generator.bind(this);
    return generator();
  }

  public complete() {
    if (!this.isRunning) {
      throwError(
        new Error(
          "Cannot complete due to instance not being in the active state. Please ensure complete() is not called more than once."
        )
      );
    }

    if (this.length === 0) {
      throwError(
        new Error(
          "Cannot complete due to instance not having any marked decisions. Please ensure mark() is called before complete()."
        )
      );
    }

    this.isRunning = false;
  }

  public display() {
    let output = "";
    this.traverse(this.root, (node) => {
      output += `${node.value?.key || "⏺"}${
        node.value?.value ? ` = ${node.value.value}` : ""
      }${node.children.length > 0 ? "\n⇣" : ""}\n`;
    });
    return output;
  }
}
