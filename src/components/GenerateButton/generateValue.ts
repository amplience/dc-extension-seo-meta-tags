import type { ContentFieldExtension } from "dc-extensions-sdk";
import { EVENTS } from "../../lib";
import { getText } from "./getText";

export const generateValue = async (
  sdk: ContentFieldExtension
): Promise<string | null> => {
  const text = await getText(sdk);
  const hasText = text.length > 0;

  if (!hasText) {
    return null;
  }

  const { data } = await sdk.connection
    .request(EVENTS.MUTATION, {})
    .catch(() => ({ data: null }));

  return data;
};
