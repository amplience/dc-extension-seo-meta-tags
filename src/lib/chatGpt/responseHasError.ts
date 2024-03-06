import { any, includes } from "ramda";

export const responseHasError = (variants: string[]) => {
  return any(includes("[ERROR]"), variants);
};
