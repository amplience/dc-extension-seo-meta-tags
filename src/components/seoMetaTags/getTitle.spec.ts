import { ContentFieldExtension, init } from "dc-extensions-sdk";
import { getTitle } from "./getTitle";

describe("getTitle", () => {
  it("Should return 'Description'", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.schema as unknown) = {};

    const result = getTitle(sdk);

    expect(result).toEqual("Description");
  });
  it("Should return the title defined in the field schema", async () => {
    const sdk = await init<ContentFieldExtension>();

    const result = getTitle(sdk);

    expect(result).toEqual(sdk.field.schema.title);
  });
});
