import { render, screen, waitFor } from "@testing-library/react";
import { Card } from "./Card";
import userEvent from "@testing-library/user-event";

describe("Card", () => {
  it("Should show title", async () => {
    render(<Card title="Hello" onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText("Hello")).toBeInTheDocument();
    });
  });

  it("Should show info tooltip", async () => {
    render(<Card title="Hello" info="some info" onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId("info")).toBeInTheDocument();
    });

    await userEvent.hover(screen.getByTestId("info"));

    await waitFor(() => {
      expect(screen.getByText("some info")).toBeInTheDocument();
    });
  });

  it("Should show loader", async () => {
    render(<Card title="Hello" loading={true} onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId("loader")).toBeInTheDocument();
    });
  });

  it("Should show content", async () => {
    render(
      <Card title="Hello" onClose={() => {}}>
        <div>Some content</div>
      </Card>
    );

    await waitFor(() => {
      expect(screen.getByText("Some content")).toBeInTheDocument();
    });
  });

  it("Should fire close event when close clicked", async () => {
    const close = jest.fn();
    render(<Card title="Hello" onClose={close} />);

    await waitFor(() => {
      expect(screen.getByTestId("closeCard")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId("closeCard"));

    expect(close).toHaveBeenCalled();
  });
});
