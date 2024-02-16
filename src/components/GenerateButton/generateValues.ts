import type { ContentFieldExtension } from "dc-extensions-sdk";
import { EVENTS, isEmptyString } from "../../lib";
import { getText } from "./getText";

export const generateValues = async (
  sdk: ContentFieldExtension
): Promise<string[] | null> => {
  const text = await getText(sdk);

  if (isEmptyString(text)) {
    return null;
  }

  const { data } = await sdk.connection
    .request(EVENTS.MUTATION, {})
    .catch(() => ({ data: null }));

  return data;
};
