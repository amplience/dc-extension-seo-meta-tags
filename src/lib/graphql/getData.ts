import { path } from "ramda";

export const getData = path(["data", "generateSEOText", "variants"]) as {
  (r: unknown): string[];
};
