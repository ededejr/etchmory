import { Decision, SourceValue } from "../../types";
import { throwError } from "../../utils";
import { MemoryObject } from "../memory/memory-object";
import { LinkedList } from "./linked-list";

export class LinearMemory extends MemoryObject {
  private madeDecisions: string[] = [];
  private memory = new LinkedList<Decision>();

  get size() {
    return this.memory.length;
  }

  public mark(decision: string, value: SourceValue) {
    this.ensureIsActive();

    if (this.madeDecisions.includes(decision)) {
      throwError(new Error(`Decision "${decision}" already exists`));
    }
    this.memory.add({ key: decision, value });
    this.madeDecisions.push(decision);
  }

  public recall(decision: string) {
    this.ensureIsComplete();
    const node = this.memory.find(({ key }) => key === decision);
    if (!node) {
      throw new Error(`Decision "${decision}" does not exist`);
    }
    return node.value.value;
  }

  public replay() {
    this.ensureIsComplete();
    let generator = function* generator() {
      let current = this.memory.head;
      while (current !== null) {
        yield current.value;
        current = current.next;
      }
    };
    generator = generator.bind(this);
    return generator();
  }

  protected generateToken() {
    const token = ["lm:"];

    this.memory.traverse((value) => {
      token.push(`${value.key}/${value.value}`);
    });

    return token.join(":");
  }

  protected onCompletion() {
    this.madeDecisions = [];
  }
}
