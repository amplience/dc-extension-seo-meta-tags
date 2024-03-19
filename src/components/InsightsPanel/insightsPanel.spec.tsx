import { render, screen, waitFor } from "@testing-library/react";
import { InsightsPanel } from "./InsightsPanel";
import { wrapper } from "../../__mocks__/wrapper";
import { init, ContentFieldExtension } from "dc-extensions-sdk";
import userEvent from "@testing-library/user-event";
// import userEvent from "@testing-library/user-event";

jest.mock("dc-extensions-sdk", () => {
  const originalModule = jest.requireActual(
    "../../__mocks__/dc-extensions-sdk"
  );
  jest.spyOn(originalModule, "init");
  return originalModule;
});

const insights = {
  data: {
    generateSEOText: {
      variants: [
        JSON.stringify({
          overallScore: 81,
          readabilityScore: 20,
          accessibilityScore: 30,
          positive: ["a", "b", "c"],
          negative: ["d", "e", "f"],
        }),
      ],
    },
  },
};

describe("InsightsPanel", () => {
  it("Should show error message if insights fail to load", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});
    (sdk.connection.request as jest.Mock).mockRejectedValue("Error");

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<InsightsPanel onClose={jest.fn()} value="Generated text" />, {
      wrapper,
    });

    await waitFor(() => {
      expect(
        screen.getByText("Sorry, something went wrong.")
      ).toBeInTheDocument();
    });
  });

  it("Should show loading icon when loading", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});
    (sdk.connection.request as jest.Mock).mockResolvedValue(insights);

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<InsightsPanel onClose={jest.fn()} value="Generated text" />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId("loader")).toBeInTheDocument();
    });
  });

  it("Should show insights", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});
    (sdk.connection.request as jest.Mock).mockResolvedValue(insights);

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<InsightsPanel onClose={jest.fn()} value="Generated text" />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByText(/Showing results for/)).toBeInTheDocument();
    });
  });

  it("Should fire onClose when close icon clicked", async () => {
    const sdk = await init<ContentFieldExtension>();
    const close = jest.fn();
    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});
    (sdk.connection.request as jest.Mock).mockResolvedValue(insights);

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<InsightsPanel onClose={close} value="Generated text" />, {
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

  it("Should show correct title", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});
    (sdk.connection.request as jest.Mock).mockResolvedValue(insights);

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<InsightsPanel onClose={jest.fn()} value="Generated text" />, {
      wrapper,
    });

    await waitFor(() => {
      expect(
        screen.getByText("Showing results for meta description:")
      ).toBeInTheDocument();
    });
  });

  it("Should show correct value", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});
    (sdk.connection.request as jest.Mock).mockResolvedValue(insights);

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<InsightsPanel onClose={jest.fn()} value="Generated text" />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByText(/Generated text/)).toBeInTheDocument();
    });
  });

  it("Should show overall score", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});
    (sdk.connection.request as jest.Mock).mockResolvedValue(insights);

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<InsightsPanel onClose={jest.fn()} value="Generated text" />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByText("81/100")).toBeInTheDocument();
    });
  });

  it("Should show scores for individual factors", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});
    (sdk.connection.request as jest.Mock).mockResolvedValue(insights);

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<InsightsPanel onClose={jest.fn()} value="Generated text" />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByText("8")).toBeInTheDocument();
      expect(screen.getByText("20")).toBeInTheDocument();
      expect(screen.getByText("30")).toBeInTheDocument();
    });
  });

  it("Should show further insights when button clicked", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});
    (sdk.connection.request as jest.Mock).mockResolvedValue(insights);

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<InsightsPanel onClose={jest.fn()} value="Generated text" />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByText("View insights")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("View insights"));

    await waitFor(() => {
      expect(screen.getByText("Positive signs")).toBeInTheDocument();
      expect(screen.getByText("Negative signs")).toBeInTheDocument();
    });
  });

  it("Should hide insights wwhen button clicked", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});
    (sdk.connection.request as jest.Mock).mockResolvedValue(insights);

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<InsightsPanel onClose={jest.fn()} value="Generated text" />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByText("View insights")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("View insights"));

    await waitFor(() => {
      expect(screen.getByText("Positive signs")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("Hide insights"));

    await waitFor(() => {
      expect(screen.queryByText("Positive signs")).not.toBeInTheDocument();
    });
  });

  it("Should list insights", async () => {
    const sdk = await init<ContentFieldExtension>();

    (sdk.field.getValue as jest.Mock).mockResolvedValue("test");
    (sdk.form.getValue as jest.Mock).mockResolvedValue({});
    (sdk.connection.request as jest.Mock).mockResolvedValue(insights);

    (init as jest.Mock).mockResolvedValue(sdk);

    render(<InsightsPanel onClose={jest.fn()} value="Generated text" />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByText("View insights")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("View insights"));

    await waitFor(() => {
      const positive = screen.getByTestId("insights-positive");
      const negative = screen.getByTestId("insights-negative");

      expect(positive).toContainElement(screen.getByText("a"));
      expect(positive).toContainElement(screen.getByText("b"));
      expect(positive).toContainElement(screen.getByText("c"));

      expect(negative).toContainElement(screen.getByText("d"));
      expect(negative).toContainElement(screen.getByText("e"));
      expect(negative).toContainElement(screen.getByText("f"));
    });
  });
});
