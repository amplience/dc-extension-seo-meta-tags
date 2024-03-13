import { getErrorCode } from ".";

describe("getError", () => {
  it("Should get error from response", () => {
    const code = getErrorCode({
      data: { errors: [{ extensions: { code: "INSUFFICIENT_CREDITS" } }] },
    });

    expect(code).toEqual("INSUFFICIENT_CREDITS");
  });

  it("Should default to 'SYSTEM_ERROR'", () => {
    const code = getErrorCode({});

    expect(code).toEqual("SYSTEM_ERROR");
  });
});
