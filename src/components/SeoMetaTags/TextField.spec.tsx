import { act, render, screen, waitFor } from "@testing-library/react";
import { TextField } from "./TextField";
import { wrapper } from "../../__mocks__/wrapper";
import userEvent from "@testing-library/user-event";
import { init, ContentFieldExtension } from "dc-extensions-sdk";

jest.mock("dc-extensions-sdk", () => {
  const originalModule = jest.requireActual(
    "../../__mocks__/dc-extensions-sdk"
  );
  jest.spyOn(originalModule, "init");
  return originalModule;
});

describe("TextField", () => {
  it("Should trigger onChange event when field is valid", async () => {
    const sdk = await init<ContentFieldExtension>();
    const onChange = jest.fn();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(
      <TextField
        disabled={false}
        onChange={onChange}
        placeholder="Hello"
        value=""
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    await userEvent.type(screen.getByRole("textbox"), "goodbye");

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith("goodbye");
    });
  });
  it("Should not trigger onChange event when field is invalid", async () => {
    const sdk = await init<ContentFieldExtension>();
    const onChange = jest.fn();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (sdk.field.schema as unknown) = {
      pattern: `^[\\w\\s]+$`,
    };

    (init as jest.Mock).mockResolvedValue(sdk);

    render(
      <TextField
        disabled={false}
        onChange={onChange}
        placeholder="Hello"
        value=""
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    await userEvent.type(screen.getByRole("textbox"), "@goodbye#>*");

    await waitFor(() => {
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it("Should show an error message when invalid", async () => {
    const sdk = await init<ContentFieldExtension>();
    const onChange = jest.fn();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (sdk.field.schema as unknown) = {
      maxLength: 10,
    };

    (init as jest.Mock).mockResolvedValue(sdk);

    render(
      <TextField
        disabled={false}
        onChange={onChange}
        placeholder="Hello"
        value=""
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    await userEvent.type(screen.getByRole("textbox"), "this is too long");

    await waitFor(() => {
      expect(
        screen.getByText("Description should not be longer than 10 characters")
      ).toBeInTheDocument();
    });
  });

  it("Should show placeholder", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (sdk.field.schema as unknown) = {
      maxLength: 10,
      minLength: 5,
      pattern: `^[\\w\\s]+$`,
    };

    (init as jest.Mock).mockResolvedValue(sdk);

    render(
      <TextField
        disabled={false}
        onChange={() => {}}
        placeholder="Hello"
        value=""
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveProperty(
        "placeholder",
        "Hello"
      );
    });
  });

  it("Should be disabled when disabled proerty set", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(
      <TextField
        disabled={true}
        onChange={() => {}}
        placeholder="Hello"
        value=""
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toBeDisabled();
    });
  });

  it("Should be disabled in readonly mode", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(
      <TextField
        disabled={true}
        onChange={() => {}}
        placeholder="Hello"
        value=""
      />,
      { wrapper }
    );

    act(() => {
      (
        sdk.form as unknown as {
          readOnlySubscribers: { (b: boolean): void }[];
        }
      ).readOnlySubscribers[0](true);
    });

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toBeDisabled();
    });
  });

  it("Should display the value", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(
      <TextField
        disabled={true}
        onChange={() => {}}
        placeholder="Hello"
        value="this is the value"
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveValue("this is the value");
    });
  });
});
