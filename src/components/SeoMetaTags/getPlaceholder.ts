import { ContentFieldExtension } from "dc-extensions-sdk";
import { getParams } from "../../lib/sdk/getParams";

export const getPlaceholder = (sdk: ContentFieldExtension) => {
  const { type } = getParams(sdk);

  if (type === "keywords") {
    return "Generate or start typing keywords to add";
  }

  return `Generate or write your own ${type}`;
};
