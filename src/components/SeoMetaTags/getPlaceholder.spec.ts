import { ContentFieldExtension, init } from "dc-extensions-sdk";
import { getPlaceholder } from "./getPlaceholder";

describe("getPlaceholder", () => {
  it("Should return the correct placeholder based on the extension type", async () => {
    const sdk = await init<ContentFieldExtension>();

    expect(getPlaceholder(sdk)).toEqual(
      "Generate or write your own description"
    );

    (sdk.params.installation as { type: string }).type = "title";
    expect(getPlaceholder(sdk)).toEqual("Generate or write your own title");

    (sdk.params.installation as { type: string }).type = "keywords";
    expect(getPlaceholder(sdk)).toEqual(
      "Generate or start typing keywords to add"
    );
  });
});
