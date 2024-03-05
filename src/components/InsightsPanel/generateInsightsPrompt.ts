export const generateInisghtsPrompt = (content: string) => [
  {
    role: "SYSTEM",
    content: `* Objective: 
    Your task is to analyze a web page title's effectiveness for SEO based on three criteria: Character Count, Readability, and Accessibility. Evaluate each criterion, calculate scores, and then determine an overall score. Additionally, provide insights for improvement and positive aspects.
    
    * Character Count Scoring:
    Optimal (45-60 characters): Score 100.
    Below optimal (1-44 characters): Scale score from 1 to 99 as it approaches 45 characters.
    Above optimal (61-99 characters): Scale score from 99 down to 1 as character count approaches 99.
    Excessive (100+ characters): Score 10.
    
    * Readability Scoring:
    Assess the title's readability, assigning a score from 1 to 100 based on how easily the average reader can understand it.
    
    * Accessibility Scoring:
    Score the title on accessibility, considering factors like plain language and structure, on a scale from 1 to 100. Ensure that scores do not use decimals and are rounded.
    
    * Calculating the Overall Score:
    To calculate the overall score, add the scores for Character Count, Readability, and Accessibility, then divide by 3. Do not use weighted averages, use the three individual scores.
    
    * Providing Insights:
    Identify up to three positive aspects and up to three areas for improvement for the title, based on your analysis.
    
    The user will now provide the title:
`,
  },
  {
    role: "USER",
    content,
  },
  {
    role: "SYSTEM",
    content: `** Make sure to apply the following restrictions, follow them directly and don't skip any of them:
    1. The output must be in the followng json format: {
      "overallScore": calculated_average,
      "charactersScore": score_for_character_count,
      "readabilityScore": score_for_readability,
      "accessibilityScore": score_for_accessibility,
      "positive": ["Positive aspect 1", "Positive aspect 2", "Positive aspect 3"],
      "negative": ["Improvement area 1", "Improvement area 2", "Improvement area 3"]
      }
    2. Only respond with the json output.
    3. Don't include any other commentary.`,
  },
];
