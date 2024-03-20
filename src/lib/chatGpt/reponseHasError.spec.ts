import { responseHasError } from "./responseHasError";

describe("responseHasError", () => {
  it("Should return true if any of the response variants contains [ERROR]", () => {
    const variants = {
      data: {
        generateSEOText: {
          variants: [
            "this is a nice title",
            "wow, this is working",
            "[ERROR] this does not work",
            "yep i am fine",
          ],
        },
      },
    };

    expect(responseHasError(variants)).toEqual(true);
  });
  it("Should return false if none of the variants has an error", () => {
    const variants = {
      data: {
        generateSEOText: {
          variants: [
            "this is a nice title",
            "wow, this is working",
            "nothing to see here",
            "yep i am fine",
          ],
        },
      },
    };

    expect(responseHasError(variants)).toEqual(false);
  });

  it("Should return true if the response is in the wrong format", () => {
    expect(
      responseHasError({
        data: {
          somethingIsWrong: {
            variants: [
              "this is a nice title",
              "wow, this is working",
              "nothing to see here",
              "yep i am fine",
            ],
          },
        },
      })
    ).toEqual(true);
  });
});
