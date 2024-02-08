import { ContentFieldExtension, init } from "dc-extensions-sdk";
import { generateValue } from "./generateValue";

describe("generateValue", () => {
  it("Should return null if there isn't any text", async () => {
    const sdk = await init<ContentFieldExtension>();
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    const result = await generateValue(sdk);

    expect(result).toBe(null);
  });
  it("Should return null if the mutation request fails", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "A really interesting article",
    });

    (sdk.connection.request as jest.Mock).mockRejectedValue("Could not mutate");

    const result = await generateValue(sdk);

    expect(result).toBe(null);
  });

  it("Should return the generated text", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "A really interesting article",
    });

    (sdk.connection.request as jest.Mock).mockResolvedValue({
      data: "Possibly THE best article in the world... ever",
    });

    const result = await generateValue(sdk);

    expect(result).toBe("Possibly THE best article in the world... ever");
  });
});
