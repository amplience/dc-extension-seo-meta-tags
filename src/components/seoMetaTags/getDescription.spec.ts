import { ContentFieldExtension, init } from "dc-extensions-sdk";
import { getDescription } from "./getDescription";

describe("getDescription", () => {
  it("Should return a description containg the word 'description'", async () => {
    const sdk = await init<ContentFieldExtension>();

    sdk.params.installation = {
      type: "description",
    };

    const result = getDescription(sdk);

    expect(result).toContain("SEO description");
  });
  it("Should return a description containg the word 'title'", async () => {
    const sdk = await init<ContentFieldExtension>();

    sdk.params.installation = {
      type: "title",
    };

    const result = getDescription(sdk);

    expect(result).toContain("SEO title");
  });
});
