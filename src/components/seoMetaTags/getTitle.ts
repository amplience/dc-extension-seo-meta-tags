import { ContentFieldExtension } from "dc-extensions-sdk";
import { getParams } from "../../lib/sdk/getParams";
import upperFirst from "lodash/upperFirst";

export const getTitle = (sdk: ContentFieldExtension) => {
  const { variant } = getParams(sdk);

  return sdk.field.schema.title || upperFirst(variant);
};
