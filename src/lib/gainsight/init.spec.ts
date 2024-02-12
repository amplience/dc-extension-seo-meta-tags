import { init } from ".";

const mockDocument = {
  createElement: jest.fn(),
  getElementsByTagName: jest.fn(),
};

const mockWindow = {
  document: mockDocument,
};

describe("init", () => {
  it("should not initialise aptrinsic if aptrinsicId is not provided", () => {
    init(mockWindow as unknown as Window, "");
    expect(mockWindow).not.toHaveProperty("aptrinsic");
    expect(mockDocument.createElement).not.toHaveBeenCalled();
  });

  it("should initialise aptrinsic and append script element with correct src", () => {
    const aptrinsicId = "your-aptrinsic-id";
    const el = { src: "" };
    const scripts = [
      {
        parentNode: { insertBefore: jest.fn() },
      },
    ];
    mockDocument.createElement.mockImplementation(() => el);
    mockDocument.getElementsByTagName.mockImplementation(() => scripts);

    init(mockWindow as unknown as Window, aptrinsicId);

    expect(
      typeof (mockWindow as unknown as { aptrinsic: { (): void } }).aptrinsic
    ).toEqual("function");
    expect(mockDocument.createElement).toHaveBeenCalledWith("script");
    expect(el.src).toEqual(
      `https://web-sdk.aptrinsic.com/api/aptrinsic.js?a=${aptrinsicId}`
    );
  });

  it("should insert script before the first script tag in the document", () => {
    const aptrinsicId = "your-aptrinsic-id";
    init(mockWindow as unknown as Window, aptrinsicId);

    expect(mockDocument.getElementsByTagName).toHaveBeenCalledWith("script");
    expect(
      mockDocument.getElementsByTagName()[0].parentNode.insertBefore
    ).toHaveBeenCalled();
  });

  it("Should append args to q when aptrinsic function called", () => {
    const aptrinsicId = "your-aptrinsic-id";

    init(mockWindow as unknown as Window, aptrinsicId);

    (
      mockWindow as unknown as { aptrinsic: { (...args: unknown[]): void } }
    ).aptrinsic("test", "append", true);

    expect(
      (mockWindow as unknown as { aptrinsic: { q: [] } }).aptrinsic.q
    ).toEqual([["test", "append", true]]);
  });
});
