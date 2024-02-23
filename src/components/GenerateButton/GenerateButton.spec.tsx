import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GenerateButton } from "./GenerateButton";
import { ContentFieldExtension, init } from "dc-extensions-sdk";
import { track } from "../../lib";
import { wrapper } from "../../__mocks__/wrapper";

jest.mock("../../lib/gainsight/track.ts", () => ({
  track: jest.fn(),
}));

jest.mock("dc-extensions-sdk", () => {
  const originalModule = jest.requireActual(
    "../../__mocks__/dc-extensions-sdk"
  );
  jest.spyOn(originalModule, "init");
  return originalModule;
});

describe("GenerateButton", () => {
  it("Should disable if the form changes to readonly mode", async () => {
    const sdk = await init<ContentFieldExtension>();

    (init as jest.Mock).mockResolvedValue(sdk);

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "some content",
    });

    render(<GenerateButton onTextGenerated={jest.fn()} />, { wrapper });

    await waitFor(() => {
      const btn = screen.getByRole("button");
      expect(btn).toHaveProperty("disabled", false);
    });

    act(() => {
      (
        sdk.form as unknown as {
          readOnlySubscribers: { (b: boolean): void }[];
        }
      ).readOnlySubscribers[0](true);
    });

    await waitFor(() => {
      const btn = screen.getByRole("button");
      expect(btn).toHaveProperty("disabled", true);
    });
  });
  it("Should be disabled if disabled property is set", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "some content",
    });

    (init as jest.Mock).mockResolvedValue(sdk);

    const { rerender } = render(
      <GenerateButton onTextGenerated={jest.fn()} disabled={false} />,
      {
        wrapper,
      }
    );

    await waitFor(() => {
      const btn = screen.getByRole("button");
      expect(btn).toHaveProperty("disabled", false);
    });

    rerender(<GenerateButton onTextGenerated={jest.fn()} disabled={true} />);

    await waitFor(() => {
      const btn = screen.getByRole("button");
      expect(btn).toHaveProperty("disabled", true);
    });
  });

  it("Should pass props down to the inner button", async () => {
    const sdk = await init<ContentFieldExtension>();

    (init as jest.Mock).mockResolvedValue(sdk);

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "some content",
    });

    render(
      <GenerateButton onTextGenerated={jest.fn()} data-id="can you see me?" />,
      {
        wrapper,
      }
    );
    await waitFor(() => {
      const btn = screen.getByRole("button");
      expect(btn.dataset.id).toEqual("can you see me?");
    });
  });

  it("Should be disabled if there is no content in the form", async () => {
    const sdk = await init<ContentFieldExtension>();

    (init as jest.Mock).mockResolvedValue(sdk);

    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    render(<GenerateButton onTextGenerated={jest.fn()} />, { wrapper });

    await waitFor(() => {
      const btn = screen.getByRole("button");
      expect(btn).toHaveProperty("disabled", true);
    });
  });

  it("Should not fire the `onTextGenerated` event if no text has been generated", async () => {
    const sdk = await init<ContentFieldExtension>();
    const onTextGenerated = jest.fn();

    (init as jest.Mock).mockResolvedValue(sdk);

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "some content",
    });

    (sdk.connection.request as jest.Mock).mockRejectedValue("no bueno");

    render(<GenerateButton onTextGenerated={onTextGenerated} />, { wrapper });

    await waitFor(() => {
      const btn = screen.getByRole("button");
      expect(btn).toHaveProperty("disabled", false);
    });

    await waitFor(() => {
      const btn = screen.getByRole("button");

      userEvent.click(btn);

      expect(onTextGenerated).not.toHaveBeenCalled();
    });
  });
  it("Should fire the `onTextGenerated` event if text has been generated and track generation", async () => {
    const sdk = await init<ContentFieldExtension>();
    const onTextGenerated = jest.fn();

    (init as jest.Mock).mockResolvedValue(sdk);

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "some content",
    });

    (sdk.connection.request as jest.Mock).mockResolvedValue({
      data: "this is the description",
    });

    render(<GenerateButton onTextGenerated={onTextGenerated} />, { wrapper });

    await waitFor(() => {
      const btn = screen.getByRole("button");
      expect(btn).toHaveProperty("disabled", false);
    });

    await waitFor(() => {
      const btn = screen.getByRole("button");

      userEvent.click(btn);
      expect(track).toHaveBeenCalled();
      expect(onTextGenerated).toHaveBeenCalledWith("this is the description");
    });
  });
});
