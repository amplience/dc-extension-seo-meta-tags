import { getData } from ".";

describe("getData", () => {
  it("Should extract data from graphQL response", () => {
    const data = getData({
      data: { generateSEOText: { variants: ["one", "two", "three"] } },
    });

    expect(data).toEqual(["one", "two", "three"]);
  });
});
