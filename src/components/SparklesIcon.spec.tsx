import { render, screen } from "@testing-library/react";

import { SparklesIcon } from "./SparklesIcon";

describe("SparklesIcon", () => {
  it("Should have disabled colour if incative", () => {
    render(<SparklesIcon inactive={true} />);

    const icon = screen.getByTestId("icon");

    expect(icon.style.color).toEqual("rgb(217, 217, 217)");
  });
  it("Should have active colour if active", () => {
    render(<SparklesIcon />);

    const icon = screen.getByTestId("icon");

    expect(icon.style.color).toEqual("rgb(248, 139, 139)");
  });
});
