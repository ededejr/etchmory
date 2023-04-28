/**
 * GraphMemory
 *
 * Adding a note here to explain the need for both
 * MemoryGraph and GraphMemory. The MemoryGraph is a light
 * wrapper around the `Graph`. This is to get around
 * the fact that the `GraphMemory` cannot inherit from
 * both interfaces.
 */
import { Decision, SourceValue } from "../../types";
import { throwError } from "../../utils";
import { MemoryObject } from "../memory/memory-object";
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
class MemoryGraph extends Graph<Decision> {
  private current: MemoryGraphNode;
  public size = 0;

  constructor() {
    super();
    this.current = this.root;
  }

  public mark(decision: string, value: SourceValue) {
    const node = new GraphNode({ key: decision, value });
    this.current.children.push(node);
    this.current = node;
    this.size++;
  }

  public recall(decision: string) {
    const node = this.find((node) => node.value?.key === decision);
    if (!node) {
      throw new Error(`Decision "${decision}" does not exist`);
    }
    return node.value.value;
  }

  public replay(): Iterator<Decision> {
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

  public display() {
    let output = "";
    this.traverse(this.root, (node) => {
      output += `${node.value?.key || "⏺"}${
        node.value?.value ? ` = ${node.value.value}` : ""
      }${node.children.length > 0 ? "\n⇣" : ""}\n`;
    });
    return output;
  }

  public toJSON() {
    return JSON.stringify(this.root);
  }
}

/**
 * GraphMemory is a MemoryObject compliant graph that tracks decisions
 * made during an execution cycle. It is used to store the results of decisions
 * made during an execution cycle
 * and to replay them in the order they were made.
 *
 * The graph is a tree structure where each node represents a decision and its
 * value. The root node is the start of the execution cycle and the leaf node
 * is the end of the execution cycle.
 *
 * Atypically all nodes have a single child node indicating the next decision
 * made during the execution cycle.
 */
export class GraphMemory extends MemoryObject {
  private decisions: Set<string> = new Set();
  private graph = new MemoryGraph();

  public get size() {
    return this.graph.size;
  }

  public mark(decision: string, value: SourceValue) {
    this.ensureIsActive();
    if (this.decisions.has(decision)) {
      throwError(new Error(`Decision "${decision}" already exists`));
    }
    this.graph.mark(decision, value);
    this.decisions.add(decision);
  }

  public recall(decision: string) {
    this.ensureIsComplete();
    return this.graph.recall(decision);
  }

  public replay(): Iterator<Decision> {
    this.ensureIsComplete();
    return this.graph.replay();
  }

  protected onCompletion(): void {}

  protected generateToken(): string {
    return `gm::${this.graph.toJSON()}`;
  }
}
