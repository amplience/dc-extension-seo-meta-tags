import { ContentFieldExtension } from "dc-extensions-sdk";
import { getParams } from "../../lib/sdk/getParams";

export const getDescription = (sdk: ContentFieldExtension) => {
  const { type } = getParams(sdk);

  return `Generate an effective SEO ${type} based on the content of the page.`;
};
