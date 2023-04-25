import { ERROR_PREFIX } from "./constants";
import { SourceValue } from "./types";

export function throwError(err: Error) {
  const formattedError = new Error(`${ERROR_PREFIX} ${err.message}`);
  formattedError.stack = err.stack;
  throw formattedError;
}

/**
 * Coerces a string value into a SourceValue.
 */
export function parseSourceValue(value: string): SourceValue {
  const isBoolean = ["true", "false"].includes(value);

  if (isBoolean) {
    return value === "true";
  }

  const isNumber = !isNaN(Number(value));

  if (isNumber) {
    return Number(value);
  }

  return value;
}
