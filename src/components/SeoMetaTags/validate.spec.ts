import { ContentFieldExtension, init } from "dc-extensions-sdk";
import { validate } from "./validate";

describe("validate", () => {
  it("Should return success: true if valid", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.schema as unknown) = {
      maxLength: 10,
      minLength: 5,
      pattern: "^\\w+$",
    };

    const result = validate(sdk, "this is ok");

    expect(result.success).toEqual(true);
  });
  it("Should return false with message if invalid", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.schema as unknown) = {
      maxLength: 10,
      minLength: 5,
      pattern: "^\\w+$",
    };

    const result = validate(sdk, "this is not ok");

    expect(result.success).toEqual(false);
    expect(result.message).toEqual(expect.any(String));
  });

  it("Should return true if validation values are not set", async () => {
    const sdk = await init<ContentFieldExtension>();

    const result = validate(sdk, "no validation so I can put whatever I want");

    expect(result.success).toEqual(true);
  });
});
