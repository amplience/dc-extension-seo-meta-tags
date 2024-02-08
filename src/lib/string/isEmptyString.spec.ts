import { isEmptyString } from ".";

describe("isEmptyString", () => {
  it("Should return true if string is empty", () => {
    const result = isEmptyString("");

    expect(result).toEqual(true);
  });
  it("should return true if srring contains only whitespace", () => {
    const result = isEmptyString("    \n\r");

    expect(result).toEqual(true);
  });

  it("Should return false if string has other characters", () => {
    const result = isEmptyString("    false    ");

    expect(result).toEqual(false);
  });
});
