import { generateTitlePrompt } from "./generateTitlePrompt";

describe("generateTitlePrompt", () => {
  it("Should add content as prompt", () => {
    const prompts = generateTitlePrompt("generate this");

    expect(prompts[1].content).toEqual("generate this");
  });
});
