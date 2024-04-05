import { render, screen, waitFor } from "@testing-library/react";
import { KeywordsField } from "./KeywordsField";
import userEvent from "@testing-library/user-event";
import { wrapper } from "../../__mocks__/wrapper";
import { init, ContentFieldExtension } from "dc-extensions-sdk";

jest.mock("dc-extensions-sdk", () => {
  const originalModule = jest.requireActual(
    "../../__mocks__/dc-extensions-sdk"
  );
  jest.spyOn(originalModule, "init");
  return originalModule;
});

describe("KeywordsField", () => {
  it("Should clear all when button pressed", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<KeywordsField value="one, two,three" onChange={() => {}} />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByText("one")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId("clearAll"));

    await waitFor(() => {
      expect(screen.queryByText("one")).not.toBeInTheDocument();
    });
  });

  it("Should show instructions when keyword is being added", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<KeywordsField value="one, two,three" onChange={() => {}} />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByText("one")).toBeInTheDocument();
    });

    await userEvent.type(screen.getByRole("textbox"), "test");

    await waitFor(() => {
      expect(screen.getByTestId("addBtn")).toBeInTheDocument();
    });

    expect(screen.getByTestId("addBtn")).toHaveTextContent(/test/);
  });

  it("Should add keyword when instructions pressed", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<KeywordsField value="one, two,three" onChange={() => {}} />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByText("one")).toBeInTheDocument();
    });

    await userEvent.type(screen.getByRole("textbox"), "test");

    await waitFor(() => {
      expect(screen.getByTestId("addBtn")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId("addBtn"));

    await waitFor(() => {
      expect(screen.getByText("test")).toHaveClass("MuiChip-label");
    });
  });

  it("Should set keywords from field value", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<KeywordsField value="one, two,three" onChange={() => {}} />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByText("one")).toBeInTheDocument();
      expect(screen.getByText("two")).toBeInTheDocument();
      expect(screen.getByText("three")).toBeInTheDocument();
    });
  });

  it("Should call onChange when keywords change", async () => {
    const sdk = await init<ContentFieldExtension>();
    const onChange = jest.fn();
    (sdk.field.getValue as jest.Mock).mockResolvedValue("");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<KeywordsField value="one,two,three" onChange={onChange} />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByText("one")).toBeInTheDocument();
    });

    await userEvent.type(screen.getByRole("textbox"), "test{enter}");

    expect(onChange).toHaveBeenCalledWith("one, two, three, test");
  });
});
