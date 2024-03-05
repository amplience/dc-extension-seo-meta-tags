import { toSdkError } from ".";

describe("toSdkError", () => {
  it("Should format code to error response object", () => {
    const err = toSdkError("ERROR_CODE");
    expect(err).toEqual({
      data: { errors: [{ extensions: { code: "ERROR_CODE" } }] },
    });
  });
});
