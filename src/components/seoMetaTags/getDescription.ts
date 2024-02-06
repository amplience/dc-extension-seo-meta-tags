import { ContentFieldExtension } from "dc-extensions-sdk";
import { getParams } from "../../lib/getParams";

export const getDescription = (sdk: ContentFieldExtension) => {
  const { variant } = getParams(sdk);
  const defaultDescription = `Generate an effective SEO ${variant} based on the content of the page.`;

  return sdk.field.schema.description || defaultDescription;
};
