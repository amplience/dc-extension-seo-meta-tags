export const toSdkError = (code: string) => ({
  data: { errors: [{ extensions: { code } }] },
});
