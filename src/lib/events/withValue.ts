/**
 * Calls callback function with event.target.value
 * @param cb Callback function
 * @returns
 */
export const withValue =
  <T>(cb: { (v: T): unknown }) =>
  ({ target: { value } }: { target: { value: T } }) => {
    cb(value);
  };
