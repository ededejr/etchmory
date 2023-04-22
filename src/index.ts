/**
 * An object which contains decisions made during an execution cycle.
 */
type Source = Record<string, string | number>;

/**
 * Tracks decisions made during an execution cycle.
 */
export class Etchmory {
  private source: Source = {};
  private isRunning = false;
  private errorPrefix = '[Etchmory] ';

  constructor() {
    this.isRunning = true;
  }

  /**
   * Mark the result of a decision during an execution cycle.
   * @param decision
   * @param value
   */
  public mark(decision: string, value: string | number) {
    if (!this.isRunning) {
      this.reportError(new Error('Cannot mark due to instance not being in the active state'));
    }

    if (this.source[decision] !== undefined) {
      this.reportError(new Error(`Decision "${decision}" already exists`));
    }

    this.source[decision] = value;
  }

  /**
   * Get the result of a decision during an execution cycle.
   */
  public get(decision: string) {
    if (this.isRunning) {
      this.reportError(new Error('Instance must be completed before a repeatable value can be guaranteed.'));
    }

    if (this.source[decision] === undefined) {
      this.reportError(new Error(`Decision "${decision}" does not exist`));
    }

    return this.source[decision];
  }

  /**
   * Get the results of a decision during an execution cycle in the order which they
   * were produced.
   */
  public replay() {
    if (this.isRunning) {
      this.reportError(new Error('Instance must be completed before repeatable replaces can be guaranteed.'));
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

  private reportError(err: Error) {
    const formattedError = new Error(`${this.errorPrefix} ${err.message}`);
    formattedError.stack = err.stack;
    throw formattedError;
  }
}

/**
 * Parses a token into a Etchmory object.
 */
export function parseToken(token: string) {
  const source = token.split(':');
  const memory = new Etchmory();
  source.forEach((value, index) => {
    memory.mark(`${index}`, value);
  });
  memory.complete();
  return memory;
}