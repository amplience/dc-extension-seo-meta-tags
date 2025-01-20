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

  it("Should return the correct score if the count is exactly on the higher limit for each grade", () => {
    const chars60 =
      "this text has exactly 60 characters. Actually it does not so";
    const chars44 = "this text has exactly 44 characters. Actuall";
    const chars99 =
      "this text has exactly 99 characters. Actually it does not so adding a few more in to bump up the le";
    const result1 = calculateCharacterCountScore(targets, chars60);
    const result2 = calculateCharacterCountScore(targets, chars44);
    const result3 = calculateCharacterCountScore(targets, chars99);

    expect(result1.grade).toEqual("optimal");
    expect(result2.grade).toEqual("below optimal");
    expect(result3.grade).toEqual("above optimal");
  });

  it("Should return the correct score if the count is exactly on the lower limit for each grade", () => {
    const chars45 = "this text has exactly 44 characters. Actually";
    const chars1 = "X";
    const chars61 =
      "this text has exactly 61 characters. Actually it does not so.";

    const result1 = calculateCharacterCountScore(targets, chars45);
    const result2 = calculateCharacterCountScore(targets, chars1);
    const result3 = calculateCharacterCountScore(targets, chars61);

    expect(result1.grade).toEqual("optimal");
    expect(result2.grade).toEqual("below optimal");
    expect(result3.grade).toEqual("above optimal");
  });

  it("Should handle 0 length strings", () => {
    const nowt = "";
    const result = calculateCharacterCountScore(targets, nowt);

    expect(result.grade).toEqual("below optimal");
    expect(result.score).toEqual(0);
  });

  it("Should return excessive if the score exactyl matches the excessive value", () => {
    const excessive =
      "this text has 100 chars because the length is excessive. More more more more more more more more mor";

    const result = calculateCharacterCountScore(targets, excessive);

    expect(result.grade).toEqual("excessive");
    expect(result.score).toEqual(10);
  });
});
