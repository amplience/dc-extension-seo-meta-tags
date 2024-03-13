export const getMutation = (
  orgId: string,
  variants: number,
  prompts: Record<string, unknown>[]
) => ({
  mutation: `mutation generateSeoText($orgId:ID!, $variants: Int!, $prompts: [SEOGenerationPrompt!]!) {
    generateSEOText(input: {
                  organizationId: $orgId,
              variants: $variants,
              prompts: $prompts
    }) {
      variants
    }
  }`,
  vars: {
    orgId: btoa(`Organization:${orgId}`),
    variants,
    prompts,
  },
});
