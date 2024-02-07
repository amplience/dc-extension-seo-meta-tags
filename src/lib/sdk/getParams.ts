import { ContentFieldExtension } from "dc-extensions-sdk";

type Params = {
  variant: "title" | "description";
  source: string;
};

/**
 * Gets params from the SDK. Instance params will replace any installation params
 * @param sdk An instance of the SDK
 * @returns
 */
export const getParams = (sdk: ContentFieldExtension): Params =>
  ({
    variant: "title",
    ...sdk.params.installation,
    ...sdk.params.instance,
  } as Params);
