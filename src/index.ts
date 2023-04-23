import { Source, SourceValue } from "./types";
import { throwError } from "./utils";

/**
 * Tracks decisions made during an execution cycle.
 */
export class Etchmory {
  private source: Source = {};
  private isRunning = false;

  constructor() {
    this.isRunning = true;
  }

  /**
   * Mark the result of a decision during an execution cycle.
   * @param decision
   * @param value
   */
  public mark(decision: string, value: SourceValue) {
    if (!this.isRunning) {
      throwError(new Error('Cannot mark due to instance not being in the active state'));
    }

    if (this.source[decision] !== undefined) {
      throwError(new Error(`Decision "${decision}" already exists`));
    }

    this.source[decision] = value;
  }

  /**
   * Get the result of a decision during an execution cycle.
   */
  public recall(decision: string) {
    if (this.isRunning) {
      throwError(new Error('Instance must be completed before a repeatable value can be guaranteed.'));
    }

    if (this.source[decision] === undefined) {
      throwError(new Error(`Decision "${decision}" does not exist`));
    }

    return this.source[decision];
  }

  /**
   * Get the results of a decision during an execution cycle in the order which they
   * were produced.
   */
  public replay() {
    if (this.isRunning) {
      throwError(new Error('Instance must be completed before repeatable replaces can be guaranteed.'));
    }

    const createIterator = function *iterator() {
      for (const [decision, value] of Object.entries(this.source)) {
        yield value as string | number;
      }
    }

    return createIterator.bind(this)();
  }

  /**
   * Generates a token from the decisions made during an execution cycle.
   */
  public complete() {
    this.isRunning = false;
    return Object.values(this.source).join(':');
  }
}

/**
 * Parses a token into a Etchmory object.
 */
export function parseToken(token: string) {
  const source = token.split(':');
  const memory = new Etchmory();
  source.forEach((value, index) => {
    memory.mark(`${index}`, coerceValue(value));
  });
  memory.complete();
  return memory;
}

/**
 * Coerces a string value into a SourceValue.
 */
function coerceValue(value: string): SourceValue {
  const isBoolean = ['true', 'false'].includes(value);

  if (isBoolean) {
    return value === 'true';
  }

  const isNumber = !isNaN(Number(value));

  if (isNumber) {
    return Number(value);
  }

  return value;
}