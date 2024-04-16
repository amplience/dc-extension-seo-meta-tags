import pointer from "json-pointer";
import { getParams } from "..";
import type { ContentFieldExtension } from "dc-extensions-sdk";
import { isArray } from "ramda-adjunct";
import { isEmpty, join, map, pipe, reject } from "ramda";

const extractContentFromArray = pipe(
  map((content: { type: string; data: unknown }) =>
    content.type === "markdown" ? content.data : ""
  ),
  reject(isEmpty),
  join("\n")
);

export const getText = async (sdk: ContentFieldExtension) => {
  const { sources } = getParams(sdk);
  const form = await sdk.form.getValue().catch(() => ({}));

  return pipe(
    map((source: string) => {
      try {
        const content = pointer.get(form, source);
        return isArray(content) ? extractContentFromArray(content) : content;
      } catch (e) {
        return "";
      }
    }),
    join("\n")
  )(sources);
};
