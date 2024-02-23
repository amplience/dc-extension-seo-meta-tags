import { ContentFieldExtension, init } from "dc-extensions-sdk";
import { WithContentFieldExtension } from "./withContentFieldExtension";
import { act, render, waitFor } from "@testing-library/react";
import { useContext, useEffect } from "react";
import { ContentFieldExtensionContext } from "./ContentFieldExtensionContext";

jest.mock("dc-extensions-sdk", () => {
  const originalModule = jest.requireActual("../__mocks__/dc-extensions-sdk");
  jest.spyOn(originalModule, "init");
  return originalModule;
});

const DummyEl = ({
  setContext,
}: {
  setContext: { (sdk: ContentFieldExtensionContext): void };
}) => {
  const context = useContext(ContentFieldExtensionContext);

  useEffect(() => {
    setContext(context);
  }, [context, setContext]);

  return <></>;
};
describe("WithContentFieldExtension", () => {
  it("Should initialise the SDK and start the auto resizer", async () => {
    let context: ContentFieldExtensionContext;
    const sdk = await init<ContentFieldExtension>();

    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(
      <WithContentFieldExtension>
        <DummyEl
          setContext={(ctx) => {
            context = ctx;
          }}
        />
      </WithContentFieldExtension>
    );

    await waitFor(() => {
      expect(context.sdk).toEqual(sdk);
      expect(context?.sdk?.frame.startAutoResizer).toHaveBeenCalled();
    });
  });

  it("Should set 'canGenerate' to true when there is content in the form", async () => {
    let context: ContentFieldExtensionContext;
    const sdk = await init<ContentFieldExtension>();

    (init as jest.Mock).mockResolvedValue(sdk);

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "some content",
    });

    render(
      <WithContentFieldExtension>
        <DummyEl
          setContext={(ctx) => {
            context = ctx;
          }}
        />
      </WithContentFieldExtension>
    );

    await waitFor(() => {
      expect(context.sdk).toEqual(sdk);
      expect(context.canGenerate).toEqual(true);
    });
  });

  it("Should set 'canGenerate' to true if content is added to the form", async () => {
    let context: ContentFieldExtensionContext;
    const sdk = await init<ContentFieldExtension>();

    (init as jest.Mock).mockResolvedValue(sdk);

    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    // @ts-expect-error reset subscribers
    sdk.form.formValueSubscribers = [];

    render(
      <WithContentFieldExtension>
        <DummyEl
          setContext={(ctx) => {
            context = ctx;
          }}
        />
      </WithContentFieldExtension>
    );

    await waitFor(() => {
      expect(context.sdk).toEqual(sdk);
      expect(context.canGenerate).toEqual(false);
    });

    act(() => {
      (
        sdk.form as unknown as {
          formValueSubscribers: { (r: Record<string, string>): void }[];
        }
      ).formValueSubscribers[0]({ content: "some content" });
    });

    await waitFor(() => {
      expect(context.canGenerate).toEqual(true);
    });
  });

  it("Should set 'readOnly' to true when the form is in readonly mode", async () => {
    let context: ContentFieldExtensionContext;
    const sdk = await init<ContentFieldExtension>();

    (init as jest.Mock).mockResolvedValue(sdk);

    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    // @ts-expect-error reset subscribers
    sdk.form.readOnlySubscribers = [];

    render(
      <WithContentFieldExtension>
        <DummyEl
          setContext={(ctx) => {
            context = ctx;
          }}
        />
      </WithContentFieldExtension>
    );

    await waitFor(() => {
      expect(context.sdk).toEqual(sdk);
      expect(context.readOnly).toEqual(false);
    });

    act(() => {
      (
        sdk.form as unknown as {
          readOnlySubscribers: { (b: boolean): void }[];
        }
      ).readOnlySubscribers[0](true);
    });

    await waitFor(
      () => {
        expect(context.readOnly).toEqual(true);
      },
      { timeout: 2000 }
    );
  });

  it("Should log an error if we fail to initialise the sdk", async () => {
    (init as jest.Mock).mockRejectedValue("Could not init");

    jest.spyOn(console, "error");

    render(
      <WithContentFieldExtension>
        <></>
      </WithContentFieldExtension>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });
});
