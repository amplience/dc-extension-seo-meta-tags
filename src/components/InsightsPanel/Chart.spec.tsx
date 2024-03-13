import { render, screen } from "@testing-library/react";
import { Chart } from "./Chart";

describe("Chart", () => {
  it("Should show the correct colour", () => {
    render(<Chart percentage={90} />);

    expect(screen.getAllByRole("progressbar")[1]).toHaveClass(
      "MuiCircularProgress-colorSuccess"
    );
  });

  it("Should show the correct percentage", () => {
    render(<Chart percentage={66} />);

    expect(screen.getByText("66")).toBeInTheDocument();
  });
});
