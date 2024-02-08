import { ContentFieldExtension, init } from "dc-extensions-sdk";
import { getText } from "./getText";

describe("getText", () => {
  it("Should return an empty string if none of the sources in the form have content", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    const text = await getText(sdk);

    expect(text).toEqual("");
  });
  it("Should return an empty string if getValue errors", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.form.getValue as jest.Mock).mockRejectedValue("Nope, no form for you");

    const text = await getText(sdk);

    expect(text).toEqual("");
  });
  it("Should return content from all of the sources in the form", async () => {
    const sdk = await init<ContentFieldExtension>();

    sdk.params.installation = {
      sources: ["/content", "/intro", "/nested/content"],
    };

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "some text",
      intro: "an intro",
      nested: { content: "Yeah, nested" },
    });

    const text = await getText(sdk);

    expect(text).toEqual("some text\nan intro\nYeah, nested");
  });
});
