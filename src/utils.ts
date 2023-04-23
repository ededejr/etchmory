import { ERROR_PREFIX } from "./constants";

export function throwError(err: Error) {
  const formattedError = new Error(`${ERROR_PREFIX} ${err.message}`);
  formattedError.stack = err.stack;
  throw formattedError;
}