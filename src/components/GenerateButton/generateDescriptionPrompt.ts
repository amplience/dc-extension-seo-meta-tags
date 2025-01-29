export const generateDescriptionPrompt = (content: string) => [
  {
    role: "SYSTEM",
    content: `Adopt the role of an SEO expert. You will summarize the text provided by the user for use as a SERP description.
      
      The user will now provide the page content:`,
  },
  {
    role: "USER",
    content,
  },
  {
    role: "SYSTEM",
    content: `** Make sure to apply the following restrictions, follow them directly and don't skip any of them:
    1. You will limit the description to around 120 characters
    2. You can only respond with the description
    3. Your response must not be conversational
    4. Each variant of the description will be unique
    5. Return only a single description
    6. Do not return a numbered list
    7. If you don't understand the text, you will respond only with [ERROR] and nothing else`,
  },
];
