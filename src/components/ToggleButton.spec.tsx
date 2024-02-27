import { render, screen, waitFor } from "@testing-library/react";
import { ToggleButton } from "./ToggleButton";
import userEvent from "@testing-library/user-event";

describe("ToggleButton", () => {
  it("Should be disabled", async () => {
    render(<ToggleButton tooltip="test" disabled={true} value="test" />);

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  it("Should have a tooltip", async () => {
    render(
      <ToggleButton tooltip="test tooltip" disabled={false} value="test" />
    );

    await userEvent.hover(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("test tooltip")).toBeInTheDocument();
    });
  });
});
