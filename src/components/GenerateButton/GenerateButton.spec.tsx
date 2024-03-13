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

    render(
      <GenerateButton
        onTextGenerated={jest.fn()}
        onStartGeneration={jest.fn()}
        onFinishGeneration={jest.fn()}
        onError={jest.fn()}
      />,
      { wrapper }
    );

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
      <GenerateButton
        onTextGenerated={jest.fn()}
        disabled={false}
        onStartGeneration={jest.fn()}
        onFinishGeneration={jest.fn()}
        onError={jest.fn()}
      />,
      {
        wrapper,
      }
    );

    await waitFor(() => {
      const btn = screen.getByRole("button");
      expect(btn).toHaveProperty("disabled", false);
    });

    rerender(
      <GenerateButton
        onTextGenerated={jest.fn()}
        disabled={true}
        onStartGeneration={jest.fn()}
        onFinishGeneration={jest.fn()}
        onError={jest.fn()}
      />
    );

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
      <GenerateButton
        onTextGenerated={jest.fn()}
        data-id="can you see me?"
        onStartGeneration={jest.fn()}
        onFinishGeneration={jest.fn()}
        onError={jest.fn()}
      />,
      {
        wrapper,
      }
    );
    await waitFor(() => {
      const btn = screen.getByRole("button");
      expect(btn.dataset.id).toEqual("can you see me?");
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

    render(
      <GenerateButton
        onTextGenerated={onTextGenerated}
        onStartGeneration={jest.fn()}
        onFinishGeneration={jest.fn()}
        onError={jest.fn()}
      />,
      { wrapper }
    );

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
      data: {
        generateSEOText: {
          variants: ["this is the description"],
        },
      },
    });

    render(
      <GenerateButton
        onTextGenerated={onTextGenerated}
        onStartGeneration={jest.fn()}
        onFinishGeneration={jest.fn()}
        onError={jest.fn()}
      />,
      { wrapper }
    );

    await waitFor(() => {
      const btn = screen.getByRole("button");
      expect(btn).toHaveProperty("disabled", false);
    });

    await waitFor(() => {
      const btn = screen.getByRole("button");

      userEvent.click(btn);
      expect(track).toHaveBeenCalled();
      expect(onTextGenerated).toHaveBeenCalledWith(["this is the description"]);
    });
  });

  it("Should call onStartGeneration when clicked", async () => {
    const sdk = await init<ContentFieldExtension>();
    const onStartGeneration = jest.fn();

    (init as jest.Mock).mockResolvedValue(sdk);

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "some content",
    });

    render(
      <GenerateButton
        onTextGenerated={jest.fn()}
        onStartGeneration={onStartGeneration}
        onFinishGeneration={jest.fn()}
        onError={jest.fn()}
      />,
      { wrapper }
    );

    await waitFor(() => {
      const btn = screen.getByRole("button");
      expect(btn).toHaveProperty("disabled", false);
    });

    await waitFor(() => {
      const btn = screen.getByRole("button");

      userEvent.click(btn);

      expect(onStartGeneration).toHaveBeenCalled();
    });
  });

  it("Should call onFinishGeneration when generation finished", async () => {
    const sdk = await init<ContentFieldExtension>();
    const onFinishGeneration = jest.fn();

    (init as jest.Mock).mockResolvedValue(sdk);

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "some content",
    });

    (sdk.connection.request as jest.Mock).mockResolvedValue({
      data: {
        generateSEOText: {
          variants: ["this is the description"],
        },
      },
    });

    render(
      <GenerateButton
        onTextGenerated={jest.fn()}
        onStartGeneration={jest.fn()}
        onFinishGeneration={onFinishGeneration}
        onError={jest.fn()}
      />,
      { wrapper }
    );

    await waitFor(() => {
      const btn = screen.getByRole("button");
      expect(btn).toHaveProperty("disabled", false);
    });

    await waitFor(() => {
      const btn = screen.getByRole("button");

      userEvent.click(btn);

      expect(onFinishGeneration).toHaveBeenCalled();
    });
  });

  it("Should call onError if there is an error", async () => {
    const sdk = await init<ContentFieldExtension>();
    const onError = jest.fn();

    (init as jest.Mock).mockResolvedValue(sdk);

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "some content",
    });

    (sdk.connection.request as jest.Mock).mockRejectedValue({});

    render(
      <GenerateButton
        onTextGenerated={jest.fn()}
        onStartGeneration={jest.fn()}
        onFinishGeneration={jest.fn()}
        onError={onError}
      />,
      { wrapper }
    );

    await waitFor(() => {
      const btn = screen.getByRole("button");
      expect(btn).toHaveProperty("disabled", false);
    });

    await waitFor(() => {
      const btn = screen.getByRole("button");

      userEvent.click(btn);

      expect(onError).toHaveBeenCalledWith("Generation failed.");
    });
  });

  it("Should show loader when generating", async () => {
    const sdk = await init<ContentFieldExtension>();

    (init as jest.Mock).mockResolvedValue(sdk);

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "some content",
    });

    (sdk.connection.request as jest.Mock).mockResolvedValue({
      data: {
        generateSEOText: {
          variants: ["this is the description"],
        },
      },
    });

    render(
      <GenerateButton
        onTextGenerated={jest.fn()}
        onStartGeneration={jest.fn()}
        onFinishGeneration={jest.fn()}
        onError={jest.fn()}
      />,
      { wrapper }
    );

    await waitFor(() => {
      const btn = screen.getByRole("button");
      expect(btn).toHaveProperty("disabled", false);
    });

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByTestId("loader")).toBeInTheDocument();
    });
  });
});
