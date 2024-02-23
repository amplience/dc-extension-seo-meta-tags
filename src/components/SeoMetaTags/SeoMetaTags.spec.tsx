import { act, render, screen, waitFor } from "@testing-library/react";
import { SeoMetaTags } from "./SeoMetaTags";
import { ContentFieldExtension, init } from "dc-extensions-sdk";
import userEvent from "@testing-library/user-event";
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

describe("SeoMetaTags", () => {
  it("Should set the title colour to grey if inactive", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<SeoMetaTags />, { wrapper });

    await waitFor(() => {
      screen.getByTestId("seo-component");
    });

    const title = screen.getByText(sdk.field.schema.title as string);
    const classes = [...title.classList];

    act(() => {
      (
        sdk.form as unknown as { readOnlySubscribers: { (b: boolean): void }[] }
      ).readOnlySubscribers[0](true);
    });

    expect([...title.classList]).not.toEqual(classes);
  });
  it("Should update the field value when the text changes", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<SeoMetaTags />, { wrapper });

    await waitFor(() => {
      screen.getByTestId("seo-component");
    });

    const textField = screen.getByRole("textbox");

    await userEvent.type(textField, "update me");

    expect(sdk.field.setValue).toHaveBeenCalledWith("update me");
  });

  it("Should update the field value and text when text is generated", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "rich text",
    });
    (sdk.connection.request as jest.Mock).mockResolvedValue({
      data: ["Generated title"],
    });

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<SeoMetaTags />, { wrapper });

    await waitFor(() => {
      screen.getByTestId("seo-component");
    });

    const btn = screen.getByText("Generate");

    await userEvent.click(btn);

    const radio = screen.getByRole("radio");

    await userEvent.click(radio);

    const select = screen.getByText("Select");

    await userEvent.click(select);

    expect(sdk.field.setValue).toHaveBeenCalledWith("Generated title");
  });

  it("Should not set the field value if the text is unchanged", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("initial");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<SeoMetaTags />, { wrapper });

    await waitFor(() => {
      screen.getByTestId("seo-component");
    });

    const textField = screen.getByRole("textbox");

    await waitFor(() => {
      expect(textField).toHaveValue("initial");
      expect(sdk.field.setValue).not.toHaveBeenCalledWith();
    });
  });

  it("Should disable the generate button and icon if the form is readonly", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({ content: "hello" });
    (
      sdk.form as unknown as { readOnlySubscribers: { (b: boolean): void }[] }
    ).readOnlySubscribers = [];

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<SeoMetaTags />, { wrapper });

    await waitFor(() => {
      screen.getByTestId("seo-component");
    });

    const icon = screen.getByTestId("sparkles");
    const btn = screen.getByText("Generate");

    act(() => {
      (
        sdk.form as unknown as { readOnlySubscribers: { (b: boolean): void }[] }
      ).readOnlySubscribers[0](true);
    });

    await waitFor(() => {
      expect(icon.style.color).toEqual("rgb(229, 229, 229)");
      expect(btn).toHaveProperty("disabled", true);
    });
  });

  it("Should show the correct description", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "rich text",
    });
    (sdk.connection.request as jest.Mock).mockResolvedValue({
      data: "Generated title",
    });

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<SeoMetaTags />, { wrapper });

    await waitFor(() => {
      screen.getByTestId("seo-component");
    });

    const description = screen.getByText(/SEO description/);

    expect(description).toBeInTheDocument();
  });

  it("Should show the correct title", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "rich text",
    });
    (sdk.connection.request as jest.Mock).mockResolvedValue({
      data: "Generated title",
    });

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<SeoMetaTags />, { wrapper });

    await waitFor(() => {
      screen.getByTestId("seo-component");
    });

    const title = screen.getByText("Wow, what an amazing extension!");

    expect(title).toBeInTheDocument();
  });
});
