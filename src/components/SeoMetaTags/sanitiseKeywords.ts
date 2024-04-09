import {
  pipe,
  split,
  map,
  toLower,
  replace,
  reject,
  isEmpty,
  join,
} from "ramda";

export const sanitiseKeywords = pipe(
  split(","),
  map(pipe(toLower, replace(/^ +|[. ]+$/gm, ""))),
  reject(isEmpty),
  join(", ")
);
