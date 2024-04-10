import { act, render, screen, waitFor } from "@testing-library/react";
import { PreviewPanel } from "./PreviewPanel";
import userEvent from "@testing-library/user-event";
import { init, ContentFieldExtension } from "dc-extensions-sdk";
import { noop } from "ramda-adjunct";
import { wrapper } from "../../__mocks__/wrapper";

jest.mock("dc-extensions-sdk", () => {
  const originalModule = jest.requireActual(
    "../../__mocks__/dc-extensions-sdk"
  );
  jest.spyOn(originalModule, "init");
  return originalModule;
});

let bc: unknown;

Object.defineProperty(window, "BroadcastChannel", {
  writable: true,
  value: class {
    constructor() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      bc = this;
    }
    onmessage(data: unknown) {
      noop(data);
    }
    postMessage(data: unknown) {
      this.onmessage(data);
    }
  },
});

describe("PreviewPanel", () => {
  it("Should switch views when buttons pressed", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<PreviewPanel value="" onClose={() => {}} />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId("mobile")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId("mobile"));

    await waitFor(() => {
      expect(screen.getByTestId("mobileTitle")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId("desktop"));

    await waitFor(() => {
      expect(screen.getByTestId("desktopTitle")).toBeInTheDocument();
    });
  });
  it("Should show value from context", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<PreviewPanel value="test description" onClose={() => {}} />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId("mobile")).toBeInTheDocument();
    });

    act(() => {
      (bc as { postMessage: (d: unknown) => void }).postMessage({
        data: {
          type: "title",
          sources: ["/content"],
          value: "TITLE!!",
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByText("TITLE!!")).toBeInTheDocument();
    });
  });

  it("Should show defaults when values empty", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<PreviewPanel value="test description" onClose={() => {}} />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByText(/Page title to outline/)).toBeInTheDocument();
    });
  });

  it("Should fire event when closed", async () => {
    const sdk = await init<ContentFieldExtension>();
    const close = jest.fn();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<PreviewPanel value="test description" onClose={close} />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId("closeCard")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId("closeCard"));

    await waitFor(() => {
      expect(close).toHaveBeenCalled();
    });
  });

  it("Should truncate values when they are too long", async () => {
    const sdk = await init<ContentFieldExtension>();
    const description =
      "This description is greater than 160 characters therefore it is too long to be displayed. I will have to keep typing because it still is not long enough, oh wait now it is.";

    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<PreviewPanel value={description} onClose={() => {}} />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId("mobile")).toBeInTheDocument();
    });

    act(() => {
      (bc as { postMessage: (d: unknown) => void }).postMessage({
        data: {
          type: "title",
          sources: ["/content"],
          value:
            "the title is also too long. It needs to be less than sixty chars",
        },
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "the title is also too long. It needs to be less than sixty c…"
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "This description is greater than 160 characters therefore it is too long to be displayed. I will have to keep typing because it still is not long enough, oh wai…"
        )
      ).toBeInTheDocument();
    });
  });
});
