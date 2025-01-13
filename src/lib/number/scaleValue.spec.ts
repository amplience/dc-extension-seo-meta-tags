import { scaleValue } from "./scaleValue";

describe("scaleValue", () => {
  it("Should scale a value up from one range to another", () => {
    const scaled = scaleValue([0, 1], [0, 2], 0.5);

    expect(scaled).toEqual(1);
  });

  it("Should scale a value down from one range to another", () => {
    const scaled = scaleValue([0, 2], [0, 1], 1);

    expect(scaled).toEqual(0.5);
  });

  it("Should work if the numbers supplied for the target range are backwards", () => {
    const scaled = scaleValue([1, 10], [10, 1], 9);

    expect(scaled).toEqual(2);
  });
});
