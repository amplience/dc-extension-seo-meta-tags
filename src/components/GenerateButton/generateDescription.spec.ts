import { generateDescriptionPrompt } from "./generateDescriptionPrompt";

describe("generateDescriptionPrompt", () => {
  it("Should add content as prompt", () => {
    const prompts = generateDescriptionPrompt("generate this");

    expect(prompts[1].content).toEqual("generate this");
  });
});
