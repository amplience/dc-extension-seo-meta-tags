import { ContentFieldExtension, init } from "dc-extensions-sdk";
import { getInsights } from "./getInsights";
import localforage from "localforage";

describe("getInsights", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it("Should return null if text is empty", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("");

    const insights = await getInsights(sdk);

    expect(insights).toEqual(null);
  });

  it("Should return previous response if set", async () => {
    const sdk = await init<ContentFieldExtension>();
    const prev = {
      overall: 99,
      characters: 99,
      readability: 99,
      accessibility: 99,
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

  it("Should return null if error", async () => {
    const sdk = await init<ContentFieldExtension>();
    (sdk.field.getValue as jest.Mock).mockResolvedValue("something");

    (sdk.connection.request as jest.Mock).mockRejectedValue("Nooooo!");

    const insights = await getInsights(sdk);

    expect(insights).toEqual(null);
  });

  it("Should return insights", async () => {
    const sdk = await init<ContentFieldExtension>();
    const response = {
      overall: 81,
      characters: 81,
      readability: 81,
      accessibility: 81,
    };
    (sdk.field.getValue as jest.Mock).mockResolvedValue("something");
    (sdk.connection.request as jest.Mock).mockResolvedValue({
      data: response,
    });

    const insights = await getInsights(sdk);

    expect(insights).toEqual(response);
  });

  it("Should store reponse", async () => {
    const sdk = await init<ContentFieldExtension>();
    const response = {
      overall: 1,
      characters: 1,
      readability: 1,
      accessibility: 1,
    };
    (sdk.field.getValue as jest.Mock).mockResolvedValue("something");
    (sdk.connection.request as jest.Mock).mockResolvedValue({
      data: response,
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