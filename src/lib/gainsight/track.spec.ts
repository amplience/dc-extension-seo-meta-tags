import { track } from ".";

describe("track", () => {
  it("Should track if aptrinsic initialised", () => {
    const window = { aptrinsic: jest.fn() } as unknown as Window;

    track(window, "someEvent", { test: "value" });

    expect(window.aptrinsic).toHaveBeenCalledWith("track", "someEvent", {
      test: "value",
    });
  });

  it("Should log if aptrinsic not initialised", () => {
    const window = {} as Window;

    jest.spyOn(console, "info").mockImplementation();

    track(window, "someEvent", { test: "value" });

    expect(console.info).toHaveBeenCalled();
  });
});
