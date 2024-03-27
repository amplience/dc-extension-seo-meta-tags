import type { ContentFieldExtension } from "dc-extensions-sdk";
import {
  EVENTS,
  RESPONSE_STORE,
  getData,
  isEmptyString,
  responseHasError,
  safeParse,
  toSdkError,
} from "../../lib";
import localforage from "localforage";
import { getMutation } from "../../lib/graphql/getMutation";
import { generateInisghtsPrompt } from "./generateInsightsPrompt";
import { isArray, isNumber, isObject, isString, round } from "ramda-adjunct";
import { all, allPass, assoc, evolve, pipe, when, where } from "ramda";
import { calculateCharacterCountScore } from "./calculateCharacterCountScore";

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

const SCORES = {
  optimal: { low: 45, high: 60 },
  belowOptimal: { low: 1, high: 44 },
  aboveOptimal: { low: 61, high: 99 },
  excessive: 100,
};

export const getInsights = async (
  sdk: ContentFieldExtension
): Promise<Insights | null> => {
  const text = (await sdk.field.getValue()) as string;
  const hubId = sdk.hub.organizationId;

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

  const characterCountGrade = calculateCharacterCountScore(SCORES, text);

  const insights = await sdk.connection
    .request(
      EVENTS.MUTATION,
      getMutation(
        hubId!,
        1,
        generateInisghtsPrompt(sdk, characterCountGrade, text)
      )
    )
    .then(
      when(responseHasError, () => Promise.reject(toSdkError("BAD_CONTENT")))
    )
    .then((response) => {
      const data = getData(response)[0];

      return pipe(
        evolve({
          overallScore: round,
          readabilityScore: round,
          accessibilityScore: round,
        }),
        assoc("charactersScore", characterCountGrade.score)
      )(safeParse(null, data));
    });

  if (responseIsOk(insights)) {
    store.setItem(text, insights);
  }

  return insights as Insights;
};
