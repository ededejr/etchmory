/**
 * The result of a decision made during an execution cycle.
 */
export type SourceValue = string | number | boolean;

/**
 * An object which contains decisions made during an execution cycle.
 */
export type Source = Record<string, SourceValue>;

/**
 * A decision made during an execution cycle.
 */
export interface Decision {
  key: string;
  value: SourceValue;
}
