/**
 * Standard result type for server actions.
 * Provides a consistent interface for success/error handling.
 */

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Helper to create a successful result
 */
export function success<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

/**
 * Helper to create a successful result with no data
 */
export function ok(): ActionResult<void> {
  return { success: true, data: undefined };
}

/**
 * Helper to create an error result
 */
export function failure(error: string): ActionResult<never> {
  return { success: false, error };
}
