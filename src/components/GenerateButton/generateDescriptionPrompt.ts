export const generateDescriptionPrompt = (content: string) => [
  {
    role: "SYSTEM",
    content:
      "You are an SEO expert. You will summarize the text provided by the user for use as a SERP description. You will limit the description to around 120 characters. You can only respond with the description.",
  },
  {
    role: "USER",
    content,
  },
];
