export const safeParse = <T = unknown>(defaultVal: T, value: string) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return defaultVal;
  }
};
