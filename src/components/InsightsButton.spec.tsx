import { render, screen, waitFor } from "@testing-library/react";
import { InsightsButton } from "./InsightsButton";
import { init, ContentFieldExtension } from "dc-extensions-sdk";
import userEvent from "@testing-library/user-event";
import { wrapper } from "../__mocks__/wrapper";

jest.mock("dc-extensions-sdk", () => {
  const originalModule = jest.requireActual("../__mocks__/dc-extensions-sdk");
  jest.spyOn(originalModule, "init");
  return originalModule;
});

describe("InsightsButton", () => {
  it("Should be disabled if value is null", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue(null);
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<InsightsButton selected={true} onSelect={() => {}} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId("insightsBtn")).toBeDisabled();
    });
  });

  it("Should be disabled if value is empty", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("          ");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<InsightsButton selected={true} onSelect={() => {}} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId("insightsBtn")).toBeDisabled();
    });
  });

  it("Should fire event with 'insights' on click if not selected", async () => {
    const sdk = await init<ContentFieldExtension>();
    const selected = jest.fn();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<InsightsButton selected={false} onSelect={selected} />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId("insightsBtn")).toBeEnabled();
    });

    await userEvent.click(screen.getByTestId("insightsBtn"));

    expect(selected).toHaveBeenCalledWith("insights");
  });
  it("Should fire event with 'null' on click if selected", async () => {
    const sdk = await init<ContentFieldExtension>();
    const selected = jest.fn();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<InsightsButton selected={true} onSelect={selected} />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId("insightsBtn")).toBeEnabled();
    });

    await userEvent.click(screen.getByTestId("insightsBtn"));

    expect(selected).toHaveBeenCalledWith(null);
  });
});
