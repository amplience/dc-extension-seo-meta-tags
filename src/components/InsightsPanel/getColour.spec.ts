import { getColour } from "./getColour";

describe("getColour", () => {
  it("Should return 'success' when percentage greater than 60", () => {
    expect(getColour(61)).toEqual("success");
  });
  it("Should return 'warning' when percentage greater than 30", () => {
    expect(getColour(60)).toEqual("warning");
  });

  it("Should return 'error' when percentage less than 30", () => {
    expect(getColour(30)).toEqual("error");
  });
});
