import { ContentFieldExtension, init } from "dc-extensions-sdk";
import { WithExtensionContext } from "./withExtensionContext";
import { act, render, waitFor } from "@testing-library/react";
import { useContext, useEffect } from "react";
import { ExtensionContext } from "./ExtensionContext";

jest.mock("dc-extensions-sdk", () => {
  const originalModule = jest.requireActual("../__mocks__/dc-extensions-sdk");
  jest.spyOn(originalModule, "init");
  return originalModule;
});

const DummyEl = ({
  setContext,
}: {
  setContext: { (sdk: ExtensionContext): void };
}) => {
  const context = useContext(ExtensionContext);

  useEffect(() => {
    setContext(context);
  }, [context, setContext]);

  return <></>;
};
describe("WithContentFieldExtension", () => {
  it("Should initialise the SDK and start the auto resizer", async () => {
    let context: ExtensionContext;
    const sdk = await init<ContentFieldExtension>();

    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    (init as jest.Mock).mockResolvedValue(sdk);

    render(
      <WithExtensionContext>
        <DummyEl
          setContext={(ctx) => {
            context = ctx;
          }}
        />
      </WithExtensionContext>
    );

    await waitFor(() => {
      expect(context.sdk).toEqual(sdk);
      expect(context?.sdk?.frame.startAutoResizer).toHaveBeenCalled();
    });
  });

  it("Should set 'canGenerate' to true when there is content in the form", async () => {
    let context: ExtensionContext;
    const sdk = await init<ContentFieldExtension>();

    (init as jest.Mock).mockResolvedValue(sdk);

    (sdk.form.getValue as jest.Mock).mockResolvedValue({
      content: "some content",
    });

    render(
      <WithExtensionContext>
        <DummyEl
          setContext={(ctx) => {
            context = ctx;
          }}
        />
      </WithExtensionContext>
    );

    await waitFor(() => {
      expect(context.sdk).toEqual(sdk);
      expect(context.canGenerate).toEqual(true);
    });
  });

  it("Should set 'canGenerate' to true if content is added to the form", async () => {
    let context: ExtensionContext;
    const sdk = await init<ContentFieldExtension>();

    (init as jest.Mock).mockResolvedValue(sdk);

    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    // @ts-expect-error reset subscribers
    sdk.form.formValueSubscribers = [];

    render(
      <WithExtensionContext>
        <DummyEl
          setContext={(ctx) => {
            context = ctx;
          }}
        />
      </WithExtensionContext>
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
    let context: ExtensionContext;
    const sdk = await init<ContentFieldExtension>();

    (init as jest.Mock).mockResolvedValue(sdk);

    (sdk.form.getValue as jest.Mock).mockResolvedValue({});

    // @ts-expect-error reset subscribers
    sdk.form.readOnlySubscribers = [];

    render(
      <WithExtensionContext>
        <DummyEl
          setContext={(ctx) => {
            context = ctx;
          }}
        />
      </WithExtensionContext>
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
      <WithExtensionContext>
        <></>
      </WithExtensionContext>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });
});
