export type ObjectResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
