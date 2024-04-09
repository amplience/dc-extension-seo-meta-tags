import { ContentFieldExtension } from "dc-extensions-sdk";
import { getParams } from "../../lib/sdk/getParams";

export const getDescription = (sdk: ContentFieldExtension) => {
  const { type } = getParams(sdk);

  if (type === "keywords") {
    return "Generate SEO keywords based on the content of the page.";
  }

  return `Generate an effective SEO ${type} based on the content of the page.`;
};
