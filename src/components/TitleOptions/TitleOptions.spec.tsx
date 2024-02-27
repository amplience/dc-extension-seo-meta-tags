import { TitleOptions } from "./TitleOptions";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("TitleOptions", () => {
  it("Should display options as a radio group", async () => {
    const options = ["one", "two", "three"];

    render(
      <TitleOptions
        options={options}
        onTitleSelected={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
    expect(screen.getByText("three")).toBeInTheDocument();
  });

  it("Should fire cancel event when cancel pressed", async () => {
    const options = ["one", "two", "three"];
    const cancelFn = jest.fn();
    render(
      <TitleOptions
        options={options}
        onTitleSelected={jest.fn()}
        onCancel={cancelFn}
      />
    );

    await userEvent.click(screen.getByText("Cancel"));

    expect(cancelFn).toHaveBeenCalled();
  });

  it("Should disable select button if no option is selected", async () => {
    const options = ["one", "two", "three"];

    render(
      <TitleOptions
        options={options}
        onTitleSelected={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByText("Select")).toBeDisabled();
  });

  it("Should fire selected event when select pressed", async () => {
    const options = ["one", "two", "three"];
    const selectFn = jest.fn();
    render(
      <TitleOptions
        options={options}
        onTitleSelected={selectFn}
        onCancel={jest.fn()}
      />
    );

    await userEvent.click(screen.getByText("one"));
    await userEvent.click(screen.getByText("Select"));

    expect(selectFn).toHaveBeenCalled();
  });
});
