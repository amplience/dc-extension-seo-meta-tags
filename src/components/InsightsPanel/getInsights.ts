import type { ContentFieldExtension } from "dc-extensions-sdk";
import { EVENTS, RESPONSE_STORE, getText, isEmptyString } from "../../lib";
import localforage from "localforage";

type Insights = {
  overall: number;
  characters: number;
  readability: number;
  accessibility: number;
};

export const getInsights = async (
  sdk: ContentFieldExtension
): Promise<Insights | null> => {
  const text = await getText(sdk);

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

  // return data;
  // @TODO: remove when we have a BE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        overall: 60,
        characters: 10,
        readability: 100,
        accessibility: 50,
      });
    }, 2000);
  });
};
