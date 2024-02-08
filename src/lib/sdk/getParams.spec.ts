import { ContentFieldExtension, init } from "dc-extensions-sdk";
import { getParams } from ".";

describe("getParams", () => {
  it("Should get params", async () => {
    const sdk = await init<ContentFieldExtension>();

    sdk.params.installation = { type: "title", sources: ["/content"] };

    const params = getParams(sdk);

    expect(params).toEqual(sdk.params.installation);
  });
  it("Should prefer instance params over installation params", async () => {
    const sdk = await init<ContentFieldExtension>();

    sdk.params.installation = { type: "title", sources: ["/content"] };
    sdk.params.instance = { sources: ["/pick-me"] };

    const params = getParams(sdk);

    expect(params).toEqual({ type: "title", sources: ["/pick-me"] });
  });
});
