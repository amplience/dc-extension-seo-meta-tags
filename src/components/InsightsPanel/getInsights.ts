import type { ContentFieldExtension } from "dc-extensions-sdk";
import {
  EVENTS,
  RESPONSE_STORE,
  getData,
  isEmptyString,
  safeParse,
} from "../../lib";
import localforage from "localforage";
import { getMutation } from "../../lib/graphql/getMutation";
import { generateInisghtsPrompt } from "./generateInsightsPrompt";
import { isArray, isNumber, isObject, isString, round } from "ramda-adjunct";
import { all, allPass, evolve, where } from "ramda";

export type Insights = {
  overallScore: number;
  charactersScore: number;
  readabilityScore: number;
  accessibilityScore: number;
  positive: string[];
  negative: string[];
};

const isArrayOfStrings = allPass([isArray, all(isString)]);

const responseIsOk = allPass([
  isObject,
  where({
    overallScore: isNumber,
    charactersScore: isNumber,
    readabilityScore: isNumber,
    accessibilityScore: isNumber,
    positive: isArrayOfStrings,
    negative: isArrayOfStrings,
  }),
]);

export const getInsights = async (
  sdk: ContentFieldExtension
): Promise<Insights | null> => {
  const text = (await sdk.field.getValue()) as string;
  const hubId = sdk.hub.organizationId as string;

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

  const insights = await sdk.connection
    .request(
      EVENTS.MUTATION,
      getMutation(hubId, 1, generateInisghtsPrompt(text))
    )
    .then((response) => {
      const data = getData(response)[0];
      return evolve(
        {
          overallScore: round,
          charactersScore: round,
          readabilityScore: round,
          accessibilityScore: round,
        },
        safeParse(null, data)
      );
    })
    .catch(() => null);

  if (responseIsOk(insights)) {
    store.setItem(text, insights);
  }

  return insights as Insights;
};
