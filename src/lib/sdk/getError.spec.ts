import { getError } from ".";

describe("getError", () => {
  it("Should get error from response", () => {
    const msg = getError({
      data: { errors: [{ extensions: { code: "INSUFFICIENT_CREDITS" } }] },
    });

    expect(msg).toMatch(/You're out of Amplience Credits/);
  });

  it("Should default to 'SYSTEM_ERROR'", () => {
    const msg = getError({
      data: { errors: [{ extensions: { code: "UNKNOWN" } }] },
    });

    expect(msg).toEqual("Generation failed.");
  });

  it("Should default to 'SYSTEM_ERROR'", () => {
    const msg = getError({});

    expect(msg).toEqual("Generation failed.");
  });
});
