import type { ContentFieldExtension } from "dc-extensions-sdk";
import pointer from "json-pointer";
import { getParams } from "../../lib";

export const hasContent = (
  sdk: ContentFieldExtension,
  form: Record<string, unknown>
) => {
  const { sources } = getParams(sdk);

  return sources.some((source) => pointer.has(form, source));
};
