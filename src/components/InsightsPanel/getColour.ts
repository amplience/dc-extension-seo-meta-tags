import { __, cond, gt, T } from "ramda";

export const getColour = <T = string>(percentage: number) => {
  return cond([
    [gt<number>(__, 60), () => "success"],
    [gt(__, 30), () => "warning"],
    [T, () => "error"],
  ])(percentage) as T;
};
