import { generateKeywordsPrompt } from "./generateKeywordsPrompt";

describe("generateKeywordsPrompt", () => {
  it("Should add content as prompt", () => {
    const prompts = generateKeywordsPrompt("generate this");

    expect(prompts[1].content).toEqual("generate this");
  });
});
