import { add, apply, head, multiply, pipe } from "ramda";
import { divideNum, subtractNum } from "ramda-adjunct";

const applySubtract = apply(subtractNum) as unknown as (a: number[]) => number;

export const scaleValue = (
  sourceRange: number[],
  targetRange: number[],
  value: number
) =>
  pipe(
    subtractNum(head(sourceRange) as number),
    multiply(applySubtract(targetRange)),
    divideNum(applySubtract(sourceRange)),
    add(head(targetRange) as number)
  )(value);
