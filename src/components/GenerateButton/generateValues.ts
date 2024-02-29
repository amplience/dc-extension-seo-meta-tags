import type { ContentFieldExtension } from "dc-extensions-sdk";
import { EVENTS, getParams, getData, getText, isEmptyString } from "../../lib";
import { generateDescriptionPrompt } from "./generateDescriptionPrompt";
import { generateTitlePrompt } from "./generateTitlePrompt";
import { getMutation } from "../../lib/graphql/getMutation";
import { safeParse } from "../../lib/json/safeParse";

export const generateValues = async (
  sdk: ContentFieldExtension
): Promise<string[] | null> => {
  const text = await getText(sdk);
  const { type } = getParams(sdk);
  const hubId = sdk.hub.organizationId as string;
  const prompt =
    type === "description"
      ? generateDescriptionPrompt(text)
      : generateTitlePrompt(text);
  const mutation = getMutation(hubId, 5, prompt);

  if (isEmptyString(text)) {
    return null;
  }

  return (await sdk.connection
    .request(EVENTS.MUTATION, mutation)
    .then((response) => {
      const variants = getData(response);
      return variants.map((variant: string) =>
        safeParse<string>(variant, variant)
      );
    })
    .catch(() => null)) as string[] | null;
};
