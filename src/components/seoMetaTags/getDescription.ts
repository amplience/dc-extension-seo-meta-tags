import { ContentFieldExtension } from "dc-extensions-sdk";
import { getParams } from "../../lib/sdk/getParams";

export const getDescription = (sdk: ContentFieldExtension) => {
  const { variant } = getParams(sdk);

  return `Generate an effective SEO ${variant} based on the content of the page.`;
};
