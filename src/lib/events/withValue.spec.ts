import { withValue } from ".";

describe("withValue", () => {
  it("Should call the function argument with the target value", () => {
    const mock = jest.fn();
    const test = withValue<string>(mock);

    test({ target: { value: "buongiorno!" } });

    expect(mock).toHaveBeenCalledWith("buongiorno!");
  });
});
