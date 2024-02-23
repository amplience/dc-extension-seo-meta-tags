import { act, render, screen, waitFor } from "@testing-library/react";

import { SparklesIcon } from "./SparklesIcon";
import { wrapper } from "../__mocks__/wrapper";
import { init, ContentFieldExtension } from "dc-extensions-sdk";

jest.mock("dc-extensions-sdk", () => {
  const originalModule = jest.requireActual("../__mocks__/dc-extensions-sdk");
  jest.spyOn(originalModule, "init");
  return originalModule;
});

describe("SparklesIcon", () => {
  it("Should have disabled colour if readOnly", async () => {
    const sdk = await init<ContentFieldExtension>();

    (init as jest.Mock).mockResolvedValue(sdk);

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "some content",
    });

    render(<SparklesIcon />, { wrapper });

    await waitFor(() => {
      screen.getByTestId("sparkles");
    });

    act(() => {
      (
        sdk.form as unknown as {
          readOnlySubscribers: { (b: boolean): void }[];
        }
      ).readOnlySubscribers[0](true);
    });

    await waitFor(() => {
      const icon = screen.getByTestId("sparkles");

      expect(icon.style.color).toEqual("rgb(229, 229, 229)");
    });
  });

  it("Should have disabled colour if cannot generate", async () => {
    const sdk = await init<ContentFieldExtension>();

    (init as jest.Mock).mockResolvedValue(sdk);

    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    render(<SparklesIcon />, { wrapper });

    await waitFor(() => {
      const icon = screen.getByTestId("sparkles");
      expect(icon.style.color).toEqual("rgb(229, 229, 229)");
    });
  });
  it("Should have active colour if not readonly and can generate", async () => {
    const sdk = await init<ContentFieldExtension>();

    (init as jest.Mock).mockResolvedValue(sdk);

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "some content",
    });

    render(<SparklesIcon />, { wrapper });

    await waitFor(() => {
      const icon = screen.getByTestId("sparkles");

      expect(icon.style.color).toEqual("rgb(248, 139, 139)");
    });
  });
});
