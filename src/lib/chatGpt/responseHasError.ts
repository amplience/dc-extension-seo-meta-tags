import { any, includes } from "ramda";
import { getData } from "..";

export const responseHasError = (response: unknown) => {
  try {
    const variants = getData(response);
    return any(includes("[ERROR]"), variants);
  } catch (e) {
    return true;
  }
};
