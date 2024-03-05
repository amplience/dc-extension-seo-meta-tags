import { safeParse } from ".";

describe("safeParse", () => {
  it("Should return parsed json", () => {
    const parsed = safeParse("default", '{"test": true}');

    expect(parsed).toEqual({ test: true });
  });

  it("Should return default value", () => {
    const parsed = safeParse("default", '{"test: true}');

    expect(parsed).toEqual("default");
  });
});
