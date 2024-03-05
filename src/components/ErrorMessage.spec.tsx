import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "./ErrorMessage.";

describe("ErrorMessage", () => {
  it("Should show error message", () => {
    render(<ErrorMessage error="TEST ERROR MESSAGE" />);

    expect(screen.getByText("TEST ERROR MESSAGE")).toBeInTheDocument();
  });
});
