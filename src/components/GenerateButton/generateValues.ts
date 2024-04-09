import type { ContentFieldExtension } from "dc-extensions-sdk";
import {
  EVENTS,
  getParams,
  getData,
  getText,
  isEmptyString,
  toSdkError,
} from "../../lib";
import { generateDescriptionPrompt } from "./generateDescriptionPrompt";
import { generateTitlePrompt } from "./generateTitlePrompt";
import { getMutation } from "../../lib/graphql/getMutation";
import { safeParse } from "../../lib/json/safeParse";
import { uniq, when } from "ramda";
import { responseHasError } from "../../lib/chatGpt/responseHasError";
import { generateKeywordsPrompt } from "./generateKeywordsPrompt";

const prompts = {
  title: generateTitlePrompt,
  description: generateDescriptionPrompt,
  keywords: generateKeywordsPrompt,
};

export const generateValues = async (
  sdk: ContentFieldExtension
): Promise<string[] | null> => {
  const text = await getText(sdk);
  const { type } = getParams(sdk);
  const hubId = sdk.hub.organizationId;
  const prompt = prompts[type](text) as Record<string, unknown>[];
  const numVariants = type === "keywords" ? 1 : 5;
  const mutation = getMutation(hubId!, numVariants, prompt);

  if (isEmptyString(text)) {
    return Promise.reject(toSdkError("NO_CONTENT"));
  }

  return await sdk.connection
    .request(EVENTS.MUTATION, mutation)
    .then(
      when(responseHasError, () => Promise.reject(toSdkError("BAD_CONTENT")))
    )
    .then((response) => {
      const variants = getData(response);
      return uniq(
        variants.map((variant: string) => safeParse<string>(variant, variant))
      );
    });
};
