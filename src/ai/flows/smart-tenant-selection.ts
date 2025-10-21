'use server';

/**
 * @fileOverview A smart tenant selection AI agent.
 *
 * - smartTenantSelection - A function that handles the tenant selection process.
 * - SmartTenantSelectionInput - The input type for the smartTenantSelection function.
 * - SmartTenantSelectionOutput - The return type for the smartTenantSelection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartTenantSelectionInputSchema = z.object({
  userDetails: z
    .string()
    .describe('The details of the user accessing the application.'),
  availableTenants: z
    .string()
    .describe('A list of available tenants and their descriptions.'),
  context: z
    .string()
    .describe('Additional context information such as location, time of day, etc.'),
});
export type SmartTenantSelectionInput = z.infer<typeof SmartTenantSelectionInputSchema>;

const SmartTenantSelectionOutputSchema = z.object({
  tenantId: z
    .string()
    .describe('The ID of the tenant that the user should be assigned to.'),
  reason: z
    .string()
    .describe('The reason for selecting this tenant for the user.'),
});
export type SmartTenantSelectionOutput = z.infer<typeof SmartTenantSelectionOutputSchema>;

export async function smartTenantSelection(input: SmartTenantSelectionInput): Promise<SmartTenantSelectionOutput> {
  return smartTenantSelectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartTenantSelectionPrompt',
  input: {schema: SmartTenantSelectionInputSchema},
  output: {schema: SmartTenantSelectionOutputSchema},
  prompt: `You are an expert system designed to intelligently select the correct tenant for a user based on their details and the available tenants.

  Given the following user details:
  {{userDetails}}

  And the following available tenants:
  {{availableTenants}}

  And the following context information:
  {{context}}

  Determine the most appropriate tenant for the user. Provide the tenantId and a brief reason for your selection.
  Ensure the tenantId exists in the list of available tenants.
  If no tenant can be confidently determined, provide a reason why.
  `,
});

const smartTenantSelectionFlow = ai.defineFlow(
  {
    name: 'smartTenantSelectionFlow',
    inputSchema: SmartTenantSelectionInputSchema,
    outputSchema: SmartTenantSelectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
