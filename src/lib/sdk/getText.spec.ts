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

  it("Should support json format", async () => {
    const sdk = await init<ContentFieldExtension>();

    sdk.params.installation = {
      sources: ["/content"],
    };

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: [
        {
          type: "markdown",
          data: "This is some text",
        },
        {
          type: "dc-image-link",
          data: {
            _meta: {
              schema:
                "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link",
            },
            id: "1111111-1111-1111-1111-1111111111",
            name: "img",
            endpoint: "TestEndpoint",
            defaultHost: "cdn.media.amplience.net",
          },
        },
        {
          type: "markdown",
          data: "more text",
        },
      ],
    });

    const text = await getText(sdk);

    expect(text).toEqual("This is some text\nmore text");
  });
});
