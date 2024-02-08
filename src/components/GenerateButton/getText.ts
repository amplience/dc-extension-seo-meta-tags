import pointer from "json-pointer";
import { getParams } from "../../lib";
import type { ContentFieldExtension } from "dc-extensions-sdk";

export const getText = async (sdk: ContentFieldExtension) => {
  const { sources } = getParams(sdk);
  const form = await sdk.form.getValue().catch(() => ({}));

  return sources
    .map((source) => {
      try {
        return pointer.get(form, source);
      } catch (e) {
        return "";
      }
    })
    .join("\n");
};
