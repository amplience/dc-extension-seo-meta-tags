import { ContentFieldExtension, init } from "dc-extensions-sdk";
import { generateValues } from "./generateValues";
import { EVENTS, getErrorCode } from "../../lib";

const response = {
  data: {
    generateSEOText: {
      variants: ["Possibly THE best article in the world... ever"],
    },
  },
};

describe("generateValues", () => {
  it("Should return 'NO_CONTENT' error if there isn't any text", async () => {
    const sdk = await init<ContentFieldExtension>();
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    const code = await generateValues(sdk).catch((e) => getErrorCode(e));

    expect(code).toEqual("NO_CONTENT");
  });

  it("Should use decription prompt", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "A really interesting article",
    });

    (sdk.connection.request as jest.Mock).mockResolvedValue(response);

    await generateValues(sdk);

    expect(sdk.connection.request).toHaveBeenCalledWith(
      EVENTS.MUTATION,
      expect.objectContaining({
        vars: expect.objectContaining({
          prompts: expect.arrayContaining([
            expect.objectContaining({
              content: expect.stringContaining("for use as a SERP description"),
            }),
          ]),
        }),
      })
    );
  });

  it("Should use title prompt", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.params.installation as { type: string }).type = "title";

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "A really interesting article",
    });

    (sdk.connection.request as jest.Mock).mockResolvedValue(response);

    await generateValues(sdk);

    expect(sdk.connection.request).toHaveBeenCalledWith(
      EVENTS.MUTATION,
      expect.objectContaining({
        vars: expect.objectContaining({
          prompts: expect.arrayContaining([
            expect.objectContaining({
              content: expect.stringContaining("You will write a page title"),
            }),
          ]),
        }),
      })
    );
  });

  it("Should return the generated text", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "A really interesting article",
    });

    (sdk.connection.request as jest.Mock).mockResolvedValue(response);

    const result = await generateValues(sdk);

    expect(result).toEqual(["Possibly THE best article in the world... ever"]);
  });

  it("Should handle responses containing quoted strings", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "A really interesting article",
    });

    (sdk.connection.request as jest.Mock).mockResolvedValue({
      data: {
        generateSEOText: {
          variants: ['"Possibly THE best article in the world... ever"'],
        },
      },
    });

    const result = await generateValues(sdk);

    expect(result).toEqual(["Possibly THE best article in the world... ever"]);
  });

  it("Should return a 'BAD_CONTENT' error if the API response has an error", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "A really interesting article",
    });

    (sdk.connection.request as jest.Mock).mockResolvedValue({
      data: {
        generateSEOText: {
          variants: ["[ERROR]"],
        },
      },
    });

    expect(generateValues(sdk)).rejects.toEqual({
      data: { errors: [{ extensions: { code: "BAD_CONTENT" } }] },
    });
  });
});
