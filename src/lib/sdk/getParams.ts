import { ContentFieldExtension } from "dc-extensions-sdk";

type Params = {
  variant: "title" | "description";
  source: string;
};

export const getParams = (sdk: ContentFieldExtension): Params =>
  ({
    variant: "title",
    ...sdk.params.installation,
    ...sdk.params.instance,
  } as Params);
