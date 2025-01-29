export const generateKeywordsPrompt = (content: string) => [
  {
    role: "SYSTEM",
    content: `Adopt the role of an SEO expert. You will generate keywords from the text provided by the user. 
       
    The user will now provide the page content:`,
  },
  {
    role: "USER",
    content,
  },
  {
    role: "SYSTEM",
    content: `** Make sure to apply the following restrictions, follow them directly and don't skip any of them:
    1. You will extract the most important keywords
    2. You will generate around 10 keywords
    3. The keywords must not be wrapped in speech marks or quotation marks
    4. You can only respond with the keywords
    5. Each keyword will be unique
    6. If you don't understand the text, you will respond only with [ERROR] and nothing else
    7. Your response must not be conversational
    8. the keywords will be returned as a comma separated list`,
  },
];
