import { getMutation } from ".";

describe("getMutation", () => {
  it("Should get mutation for sending to SDK", () => {
    const mutation = getMutation("abcdef", 2, [
      { role: "SYSTEM", content: "some prompt" },
    ]);

    expect(mutation).toEqual(
      expect.objectContaining({
        mutation: expect.stringContaining("mutation generateSeoText"),
        vars: {
          orgId: "T3JnYW5pemF0aW9uOmFiY2RlZg==",
          variants: 2,
          prompts: [{ role: "SYSTEM", content: "some prompt" }],
        },
      })
    );
  });
});
