import { ERRORS } from "..";
import { getErrorCode } from "./getErrorCode";

export const getError = (response: unknown): string => {
  const code = getErrorCode(response);
  const message = ERRORS[code as keyof typeof ERRORS] || ERRORS.SYSTEM_ERROR;

  return message;
};
