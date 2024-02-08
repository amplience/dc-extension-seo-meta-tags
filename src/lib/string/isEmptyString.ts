/**
 * Test if a string contains only whitespace
 * @param text The string to test
 * @returns
 */
export const isEmptyString = (text: string) => /^\s{0,}$/.test(text);
