export enum EVENTS {
  MUTATION = "dc-management-sdk-js:graphql-mutation",
  ERROR_TOAST = "toast-error",
}

export const EXTENSION_NAME = "dc-extension-seo-meta-tags";
export const RESPONSE_STORE = "responses";

export enum ERRORS {
  INSUFFICIENT_CREDITS = "You're out of Amplience Credits. You can still use the field to compose text yourself.",
  NO_CONTENT = "Generation failed as there is no content in the associated text field(s)",
  SYSTEM_ERROR = "Generation failed, please retry.",
  BAD_CONTENT = "Could not generate a response for the content provided.",
}
