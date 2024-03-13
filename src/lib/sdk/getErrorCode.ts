type ErrorResponse = {
  data: { errors: { extensions: { code: string } }[] };
};
export const getErrorCode = (response: unknown): string => {
  return (
    (response as ErrorResponse)?.data?.errors?.[0]?.extensions?.code ||
    "SYSTEM_ERROR"
  );
};
