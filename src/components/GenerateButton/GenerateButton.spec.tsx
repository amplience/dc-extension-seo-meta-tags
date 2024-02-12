import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GenerateButton } from "./GenerateButton";
import { ContentFieldExtension, init } from "dc-extensions-sdk";
import { track } from "../../lib";

jest.mock("../../lib/gainsight/track.ts", () => ({
  track: jest.fn(),
}));

describe("GenerateButton", () => {
  it("Should be disabled if disabled property is set", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "some content",
    });

    render(
      <GenerateButton onTextGenerated={jest.fn()} disabled={true} sdk={sdk} />
    );

    const btn = screen.getByRole("button");

    await waitFor(() => {
      expect(btn).toHaveProperty("disabled", true);
    });
  });

  it("Should pass props down to the inner button", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "some content",
    });

    render(
      <GenerateButton
        onTextGenerated={jest.fn()}
        data-id="can you see me?"
        sdk={sdk}
      />
    );
    const btn = screen.getByRole("button");
    await waitFor(() => {
      expect(btn.dataset.id).toEqual("can you see me?");
    });
  });
  it("Should be disabled if there is no content in the form", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    render(<GenerateButton onTextGenerated={jest.fn()} sdk={sdk} />);
    const btn = screen.getByRole("button");

    await waitFor(() => {
      expect(btn).toHaveProperty("disabled", true);
    });
  });

  it("Should disable if the form changes to readonly mode", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "some content",
    });

    render(<GenerateButton onTextGenerated={jest.fn()} sdk={sdk} />);
    const btn = screen.getByRole("button");

    await waitFor(() => {
      expect(btn).toHaveProperty("disabled", false);
    });

    act(() => {
      (
        sdk.form as unknown as {
          formValueSubscribers: { (b: boolean): void }[];
        }
      ).formValueSubscribers[0](true);
    });

    await waitFor(() => {
      expect(btn).toHaveProperty("disabled", true);
    });
  });

  it("Should not fire the `onTextGenerated` event if no text has been generated", async () => {
    const sdk = await init<ContentFieldExtension>();
    const onTextGenerated = jest.fn();

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "some content",
    });

    (sdk.connection.request as jest.Mock).mockRejectedValue("no bueno");

    render(<GenerateButton onTextGenerated={onTextGenerated} sdk={sdk} />);
    const btn = screen.getByRole("button");

    await waitFor(() => {
      expect(btn).toHaveProperty("disabled", false);
    });

    await userEvent.click(btn);

    expect(onTextGenerated).not.toHaveBeenCalled();
  });
  it("Should fire the `onTextGenerated` event if text has been generated and track generation", async () => {
    const sdk = await init<ContentFieldExtension>();
    const onTextGenerated = jest.fn();

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "some content",
    });

    (sdk.connection.request as jest.Mock).mockResolvedValue({
      data: "this is the description",
    });

    render(<GenerateButton onTextGenerated={onTextGenerated} sdk={sdk} />);
    const btn = screen.getByRole("button");

    await waitFor(() => {
      expect(btn).toHaveProperty("disabled", false);
    });

    await userEvent.click(btn);

    expect(onTextGenerated).toHaveBeenCalledWith("this is the description");
    expect(track).toHaveBeenCalled();
  });
});
