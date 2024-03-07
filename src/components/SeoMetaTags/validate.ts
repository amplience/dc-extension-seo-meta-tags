import { ContentFieldExtension } from "dc-extensions-sdk";
import { z } from "zod";
import { getParams } from "../../lib";
import upperFirst from "lodash/upperFirst";

const getSchema = (
  {
    maxLength,
    minLength,
    pattern,
  }: {
    maxLength?: number;
    minLength?: number;
    pattern?: string;
  },
  type: string
) =>
  z
    .string()
    .max(maxLength as number, {
      message: `${upperFirst(
        type
      )} should NOT be longer than ${maxLength} characters`,
    })
    .min(minLength as number, {
      message: `${upperFirst(
        type
      )} should NOT be shorter than ${minLength} characters`,
    })
    .regex(new RegExp(pattern as string), {
      message: `${upperFirst(type)} should match pattern "${pattern}"`,
    });

export const validate = (sdk: ContentFieldExtension, val: string) => {
  const { type } = getParams(sdk);
  const schema = getSchema(sdk.field.schema as Record<string, unknown>, type);
  const result = schema.safeParse(val);

  if (result.success) {
    return { success: true, message: "" };
  }

  return {
    success: false,
    message: result.error.errors[0].message,
  };
};
