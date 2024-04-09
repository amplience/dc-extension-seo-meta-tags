import { render, screen, waitFor } from "@testing-library/react";
import { init, ContentFieldExtension } from "dc-extensions-sdk";
import { PreviewButton } from "./PreviewButton";
import { wrapper } from "../__mocks__/wrapper";
import userEvent from "@testing-library/user-event";

jest.mock("dc-extensions-sdk", () => {
  const originalModule = jest.requireActual("../__mocks__/dc-extensions-sdk");
  jest.spyOn(originalModule, "init");
  return originalModule;
});

describe("PreviewButton", () => {
  it("Should be disabled if no value", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue(null);
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(
      <PreviewButton disabled={false} selected={true} onSelect={() => {}} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(screen.getByTestId("previewBtn")).toBeDisabled();
    });
  });

  it("Should be disabled if value is empty", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("          ");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(
      <PreviewButton disabled={false} selected={true} onSelect={() => {}} />,
      { wrapper }
    );

    await waitFor(() => {
      expect(screen.getByTestId("previewBtn")).toBeDisabled();
    });
  });

  it("Should fire event with 'preview' if not selected", async () => {
    const sdk = await init<ContentFieldExtension>();
    const selected = jest.fn();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(
      <PreviewButton disabled={false} selected={false} onSelect={selected} />,
      {
        wrapper,
      }
    );

    await waitFor(() => {
      expect(screen.getByTestId("previewBtn")).toBeEnabled();
    });

    await userEvent.click(screen.getByTestId("previewBtn"));

    expect(selected).toHaveBeenCalledWith("preview");
  });

  it("Should fire event with 'null' if selected", async () => {
    const sdk = await init<ContentFieldExtension>();
    const selected = jest.fn();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(
      <PreviewButton disabled={false} selected={true} onSelect={selected} />,
      {
        wrapper,
      }
    );

    await waitFor(() => {
      expect(screen.getByTestId("previewBtn")).toBeEnabled();
    });

    await userEvent.click(screen.getByTestId("previewBtn"));

    expect(selected).toHaveBeenCalledWith(null);
  });
});
