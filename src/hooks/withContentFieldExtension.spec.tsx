import { ContentFieldExtension, init } from "dc-extensions-sdk";
import { WithContentFieldExtension } from "./withContentFieldExtension";
import { render, waitFor } from "@testing-library/react";
import { useContext } from "react";
import { ContentFieldExtensionContext } from "./useContentFieldExtension";

jest.mock("dc-extensions-sdk", () => {
  const originalModule = jest.requireActual("../__mocks__/dc-extensions-sdk");
  jest.spyOn(originalModule, "init");
  return originalModule;
});

describe("WithContentFieldExtension", () => {
  it("Should initialise the SDK and start the auto resizer", async () => {
    let sdkContext: ContentFieldExtension;
    const sdk = await init<ContentFieldExtension>();
    const DummyEl = () => {
      const { sdk } = useContext(ContentFieldExtensionContext) as {
        sdk: ContentFieldExtension;
      };

      sdkContext = sdk;

      return <></>;
    };

    (init as jest.Mock).mockResolvedValue(sdk);

    render(
      <WithContentFieldExtension>
        <DummyEl />
      </WithContentFieldExtension>
    );

    await waitFor(() => {
      expect(sdkContext).toEqual(sdk);
    });
    expect(sdk.frame.startAutoResizer).toHaveBeenCalled();
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
