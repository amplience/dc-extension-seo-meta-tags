import { sanitiseKeywords } from "./sanitiseKeywords";

describe("sanitiseKeywords", () => {
  it("Should split keywords and sanitise values", () => {
    const keywords = sanitiseKeywords("One  ,      two.,three");
    expect(keywords).toEqual("one, two, three");
  });
});
