import type { ContentFieldExtension } from "dc-extensions-sdk";
import { EVENTS, RESPONSE_STORE, isEmptyString } from "../../lib";
import localforage from "localforage";

export type Insights = {
  overall: number;
  characters: number;
  readability: number;
  accessibility: number;
  positive: string[];
  negative: string[];
};

export const getInsights = async (
  sdk: ContentFieldExtension
): Promise<Insights | null> => {
  const text = (await sdk.field.getValue()) as string;

  if (isEmptyString(text)) {
    return null;
  }

  const store = localforage.createInstance({
    storeName: RESPONSE_STORE,
  });
  const previousResponse = await store.getItem<Insights>(text);

  if (previousResponse) {
    return previousResponse;
  }

  const { data } = await sdk.connection
    .request(EVENTS.MUTATION, {})
    .catch(() => ({ data: null }));

  if (data) {
    store.setItem(text, data);
  }

  return data;
};
