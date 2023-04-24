import { SourceValue, Decision } from "../../types";
import { throwError } from "../../utils";

/**
 * A standardization of the interface for a memory object.
 */
export abstract class MemoryObject {
  protected isActive = true;
  protected abstract size: number;

  /**
   * Mark the result of a decision during an execution cycle.
   */
  public abstract mark(decision: string, value: SourceValue): void;
  /**
   * Get the result of a decision during an execution cycle.
   */
  public abstract recall(decision: string): SourceValue;
  /**
   * Get the results of a decision during an execution cycle in the order which they
   * were produced.
   */
  public abstract replay(): Iterator<Decision>;

  /**
   * Complete the current execution cycle.
   */
  public complete() {
    if (!this.isActive) {
      return;
    }

    if (this.size === 0) {
      throwError(new Error("Cannot complete an empty instance"));
    }

    this.isActive = false;
    if (this.onCompletion) {
      this.onCompletion();
    }
  }

  /**
   * Get the token which represents the decisions made during an execution cycle.
   */
  public getToken() {
    this.ensureIsComplete();
    return this.generateToken();
  }

  /**
   * Construct a token from the decisions made during an execution cycle.
   */
  protected abstract generateToken(): string;

  /**
   * A callback which is invoked when the current execution cycle is complete.
   * This is useful for cleaning up any resources which are no longer needed.
   * This is invoked before transitioning the `isActive` state.
   */
  protected abstract onCompletion(): void;

  protected ensureIsComplete() {
    if (this.isActive) {
      throwError(
        new Error(
          "Cannot perform action on active instance. Did you forget to call complete()?"
        )
      );
    }
  }

  protected ensureIsActive() {
    if (!this.isActive) {
      throwError(
        new Error(
          "Cannot perform action on inactive instance. Please perform this action before calling complete()"
        )
      );
    }
  }
}
