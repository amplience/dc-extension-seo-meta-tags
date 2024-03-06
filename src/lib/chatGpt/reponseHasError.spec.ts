import { responseHasError } from "./responseHasError";

describe("responseHasError", () => {
  it("Should return true if any of the response variants contains [ERROR]", () => {
    const variants = [
      "this is a nice title",
      "wow, this is working",
      "[ERROR] this does not work",
      "yep i am fine",
    ];

    expect(responseHasError(variants)).toEqual(true);
  });
  it("Should return false if none of the variants has an error", () => {
    const variants = [
      "this is a nice title",
      "wow, this is working",
      "nothing to see here",
      "yep i am fine",
    ];

    expect(responseHasError(variants)).toEqual(false);
  });
});
