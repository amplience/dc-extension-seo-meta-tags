import { calculateCharacterCountScore } from "./calculateCharacterCountScore";

const targets = {
  optimal: { low: 45, high: 60 },
  belowOptimal: { low: 1, high: 44 },
  aboveOptimal: { low: 61, high: 99 },
  excessive: 100,
};
describe("calculateCharacterCountScore", () => {
  it("Should return 100 if score is optimal", () => {
    const result = calculateCharacterCountScore(
      targets,
      "This title is quite long but it will get quite a good score"
    );

    expect(result.score).toEqual(100);
    expect(result.grade).toEqual("optimal");
  });

  it("Should return 51 if below optimal", () => {
    const result = calculateCharacterCountScore(
      targets,
      "this is just long enuff"
    );

    expect(result.score).toEqual(51);
    expect(result.grade).toEqual("below optimal");
  });

  it("Should return 47 if above optimal", () => {
    const result = calculateCharacterCountScore(
      targets,
      "this is too long to get a good score so that is unfortunate. shame it's not shorter"
    );

    expect(result.score).toEqual(47);
    expect(result.grade).toEqual("above optimal");
  });

  it("Should be a higher score if closer to bottom of the range if above optimal", () => {
    const result1 = calculateCharacterCountScore(
      targets,
      "this is too long to get a good score so that is unfortunate. shame it's not shorter"
    );
    const result2 = calculateCharacterCountScore(
      targets,
      "this is long but it is not as long so it should have a better score"
    );

    expect(result1.score).toBeLessThan(result2.score);
  });

  it("Should return 10 if excessive", () => {
    const result = calculateCharacterCountScore(
      targets,
      "wow this is far too long, it's over 100 characters. Why would anyone write a title that is this long?"
    );

    expect(result.score).toEqual(10);
    expect(result.grade).toEqual("excessive");
  });
});
