import { ContentFieldExtension, init } from "dc-extensions-sdk";
import { getInsights } from "./getInsights";
import localforage from "localforage";

describe("getInsights", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Should return a 'BAD_CONTENT' error if the API response has an error", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("something");

    (sdk.connection.request as jest.Mock).mockResolvedValue({
      data: {
        generateSEOText: {
          variants: ["[ERROR]"],
        },
      },
    });

    expect(getInsights(sdk)).rejects.toEqual({
      data: { errors: [{ extensions: { code: "BAD_CONTENT" } }] },
    });
  });

  it("Should return null if text is empty", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("");

    const insights = await getInsights(sdk);

    expect(insights).toEqual(null);
  });

  it("Should return null if response is not in the right format", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("titular");

    (sdk.connection.request as jest.Mock).mockResolvedValue({
      data: {
        generateSEOText: {
          variants: [
            '```json\n{\n  "overallScore": 67,\n  "readabilityScore": 85,\n  "accessibilityScore": 75,\n  "positive": [\n    "The title clearly outlines the benefits of dogs.",\n    "It uses simple language, making it accessible to a broad audience.",\n    "The title is engaging and likely to attract readers interested in pets."\n  ],\n  "negative": [\n    "The title is too long, reducing its effectiveness for SEO.",\n    "It could be more concise to improve character count.",\n    "Consider focusing on one or two key aspects to enhance clarity."\n  ]\n}\n```',
          ],
        },
      },
    });

    const insights = await getInsights(sdk);

    expect(insights).toEqual(null);
  });

  it("Should return previous response if set", async () => {
    const sdk = await init<ContentFieldExtension>();
    const prev = {
      overallScore: 1,
      charactersScore: 1,
      readabilityScore: 1,
      accessibilityScore: 1,
      positive: ["amazing"],
      negative: ["awful"],
    };

    (sdk.field.getValue as jest.Mock).mockResolvedValue("something");

    const forage = {
      async getItem() {
        return prev;
      },
    };

    jest
      .spyOn(localforage, "createInstance")
      .mockReturnValue(forage as unknown as LocalForage);

    const insights = await getInsights(sdk);

    expect(insights).toEqual(prev);
  });

  it("Should return insights", async () => {
    const sdk = await init<ContentFieldExtension>();
    const response = {
      overallScore: 1,
      charactersScore: 8,
      readabilityScore: 1,
      accessibilityScore: 1,
      positive: ["amazing"],
      negative: ["awful"],
    };

    (sdk.field.getValue as jest.Mock).mockResolvedValue("something");
    (sdk.connection.request as jest.Mock).mockResolvedValue({
      data: {
        generateSEOText: {
          variants: [JSON.stringify(response)],
        },
      },
    });

    const insights = await getInsights(sdk);

    expect(insights).toEqual(response);
  });

  it("Should store reponse", async () => {
    const sdk = await init<ContentFieldExtension>();
    const response = {
      overallScore: 1,
      charactersScore: 8,
      readabilityScore: 1,
      accessibilityScore: 1,
      positive: ["amazing"],
      negative: ["awful"],
    };
    (sdk.field.getValue as jest.Mock).mockResolvedValue("something");
    (sdk.connection.request as jest.Mock).mockResolvedValue({
      data: {
        generateSEOText: {
          variants: [JSON.stringify(response)],
        },
      },
    });
    const forage = {
      async getItem() {},
      setItem: jest.fn(),
    };

    jest
      .spyOn(localforage, "createInstance")
      .mockReturnValue(forage as unknown as LocalForage);

    await getInsights(sdk);

    expect(forage.setItem).toHaveBeenCalledWith("something", response);
  });
});
