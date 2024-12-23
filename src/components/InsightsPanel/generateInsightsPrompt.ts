import { ContentFieldExtension } from "dc-extensions-sdk";
import { getParams, getText } from "../../lib";
import { CharacterCountGrade } from "./calculateCharacterCountScore";

export const generateInisghtsPrompt = async (
  sdk: ContentFieldExtension,
  characterCountGrade: CharacterCountGrade,
  content: string
) => {
  const { type } = getParams(sdk);
  const pageContent = await getText(sdk);

  return [
    {
      role: "SYSTEM",
      content: `* Objective: 
    Adopt the role of an SEO expert. Your task is to analyze a web page ${type}'s effectiveness for SEO based on three criteria: Character Count, Readability, and Accessibility. Evaluate each criterion, calculate scores, and then determine an overall score. Additionally, provide insights for improvement and positive aspects.
    
    * Character Count Scoring:
    The length of the ${type} is ${characterCountGrade.grade}. It gets a score of ${characterCountGrade.score} / 100
    
    * Readability Scoring:
    Assess the ${type}'s readability, assigning a score from 1 to 100 based on how easily the average reader can understand it.
    
    * Accessibility Scoring:
    Score the ${type} on accessibility, considering factors like plain language and structure, on a scale from 1 to 100. Ensure that scores do not use decimals and are rounded.
    
    * Calculating the Overall Score:
    To calculate the overall score, add the scores for Character Count, Readability, and Accessibility, then divide by 3. Do not use weighted averages, use the three individual scores.
    
    * Providing Insights:
    Identify up to three positive aspects and up to three areas for improvement for the ${type}, based on your analysis.
    
    The user will now provide the ${type}:
`,
    },
    {
      role: "USER",
      content,
    },
    {
      role: "SYSTEM",
      content: `This is the original text that the ${type} was based on:`,
    },
    {
      role: "USER",
      content: pageContent,
    },
    {
      role: "SYSTEM",
      content: `** Make sure to apply the following restrictions, follow them directly and don't skip any of them:
    1. The output must be in the followng json format: {
      "overallScore": calculated_average,
      "readabilityScore": score_for_readability,
      "accessibilityScore": score_for_accessibility,
      "positive": ["Positive aspect 1", "Positive aspect 2", "Positive aspect 3"],
      "negative": ["Improvement area 1", "Improvement area 2", "Improvement area 3"]
      }
    2. Only respond with the json output.
    3. Don't include any other commentary.
    4. If you don't understand the text, you will respond only with [ERROR] and nothing else.
    5. Positive and negative aspects should not contradict one another.`,
    },
    {
      role: "SYSTEM",
      content: `** Evaluate the response and make sure it matches the criteria given above. If it doesn't regenerate the response and repeat the steps until it does`,
    },
  ];
};
