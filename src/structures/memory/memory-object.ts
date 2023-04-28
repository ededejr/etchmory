import { SourceValue, Decision } from "../../types";
import { throwError } from "../../utils";

/**
 * A standardization of the interface for a memory object.
 *
 * A MemoryObject tracks decisions made during an execution cycle.
 * It is used to store the results of decisions made during an execution cycle
 * and to replay them in the order they were made.
 *
 */
export abstract class MemoryObject {
  private decisions: Record<string, boolean> = {};
  private isActive = true;
  public abstract readonly size: number;

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
      throwError(
        new Error(
          "Cannot complete due to instance not having any marked decisions. Please ensure mark() is called before complete()."
        )
      );
    }

    this.isActive = false;
    this.decisions = {};
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

  /**
   * Validate a decision before insertion.
   * This should ideally be called within `mark`.
   */
  protected validateDecision(decision: string) {
    if (this.decisions[decision]) {
      throwError(new Error(`Decision "${decision}" already exists`));
    }
    this.decisions[decision] = true;
  }
}
