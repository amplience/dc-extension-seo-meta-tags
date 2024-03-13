import { ContentFieldExtension, init } from "dc-extensions-sdk";
import { hasContent } from "./hasContent";

describe("hasContent", () => {
  it("Should return false if the form doesn\t have any content", async () => {
    const sdk = await init<ContentFieldExtension>();

    sdk.params.installation = {
      sources: ["/content", "/nested/content"],
    };

    const result = hasContent(sdk, { something: "else" });

    expect(result).toEqual(false);
  });
  it("Should return true if the form has content", async () => {
    const sdk = await init<ContentFieldExtension>();

    sdk.params.installation = {
      sources: ["/content", "/nested/content"],
    };

    const result = hasContent(sdk, { nested: { content: "hola" } });

    expect(result).toEqual(true);
  });
});
