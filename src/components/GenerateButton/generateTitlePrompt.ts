export const generateTitlePrompt = (content: string) => [
  {
    role: "SYSTEM",
    content:
      "You are an SEO expert. You will write a page title for the text provided by the user. The title will include the most important keywords. You will limit the title to around 60 characters. You can only respond with the title.",
  },
  {
    role: "USER",
    content,
  },
];
