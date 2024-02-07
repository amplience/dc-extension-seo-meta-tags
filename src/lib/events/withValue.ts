export const withValue =
  <T>(cb: { (v: T): unknown }) =>
  ({ target: { value } }: { target: { value: T } }) => {
    cb(value);
  };
