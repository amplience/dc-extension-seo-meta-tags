import { add, apply, head, multiply, pipe } from "ramda";
import { divideNum, subtractNum } from "ramda-adjunct";

const applySubtract = apply(subtractNum) as unknown as (a: number[]) => number;

export const scaleValue = (
  sourceRange: [number, number],
  targetRange: [number, number],
  value: number
) =>
  pipe(
    subtractNum(head(sourceRange)),
    multiply(applySubtract(targetRange)),
    divideNum(applySubtract(sourceRange)),
    add(head(targetRange))
  )(value);
