import { __, cond, evolve, gt, length, pipe } from "ramda";
import { inRange, round } from "ramda-adjunct";
import { scaleValue } from "../../lib";

type Target = {
  low: number;
  high: number;
};

type Targets = {
  optimal: Target;
  belowOptimal: Target;
  aboveOptimal: Target;
  excessive: number;
};

export type CharacterCountGrade = {
  score: number;
  grade: "optimal" | "below optimal" | "above optimal" | "excessive";
};

export const calculateCharacterCountScore = (
  targets: Targets,
  value: string
): CharacterCountGrade =>
  pipe(
    length,
    cond([
      [
        inRange(targets.optimal.low, targets.optimal.high),
        () => ({ score: 100, grade: "optimal" }),
      ],
      [
        inRange(targets.belowOptimal.low, targets.belowOptimal.high),
        (len) => ({
          score: scaleValue(
            [targets.belowOptimal.low, targets.belowOptimal.high],
            [1, 99],
            len
          ),
          grade: "below optimal",
        }),
      ],
      [
        inRange(targets.aboveOptimal.low, targets.aboveOptimal.high),
        (len) => {
          return {
            score: scaleValue(
              [targets.aboveOptimal.low, targets.aboveOptimal.high],
              [99, 10],
              len
            ),
            grade: "above optimal",
          };
        },
      ],
      [gt(__, targets.excessive), () => ({ score: 10, grade: "excessive" })],
    ]),
    evolve({
      score: round,
    })
  )(value) as CharacterCountGrade;
