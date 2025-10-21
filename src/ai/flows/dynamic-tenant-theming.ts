'use server';

/**
 * @fileOverview A flow for dynamically applying tenant-specific themes (colors, fonts, logo).
 *
 * - applyTenantTheme - A function that determines the theme based on tenant context.
 * - ApplyTenantThemeInput - The input type for the applyTenantTheme function.
 * - ApplyTenantThemeOutput - The return type for the applyTenantTheme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ApplyTenantThemeInputSchema = z.object({
  tenantName: z.string().describe('The name of the tenant.'),
  availableThemes: z.array(z.string()).describe('The available theme names.'),
  logoDataUri: z.string().optional().describe(
    "A logo associated with the tenant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type ApplyTenantThemeInput = z.infer<typeof ApplyTenantThemeInputSchema>;

const ApplyTenantThemeOutputSchema = z.object({
  themeName: z.string().describe('The name of the theme to apply.'),
});
export type ApplyTenantThemeOutput = z.infer<typeof ApplyTenantThemeOutputSchema>;

export async function applyTenantTheme(input: ApplyTenantThemeInput): Promise<ApplyTenantThemeOutput> {
  return applyTenantThemeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'applyTenantThemePrompt',
  input: {schema: ApplyTenantThemeInputSchema},
  output: {schema: ApplyTenantThemeOutputSchema},
  prompt: `You are an expert at branding.

You are provided with the name of the tenant, a list of available theme names, and optionally a logo.

Based on this information, you will determine the most appropriate theme to apply to the application.

Tenant Name: {{{tenantName}}}
Available Themes: {{#each availableThemes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{#if logoDataUri}}
Logo: {{media url=logoDataUri}}
{{/if}}

Return ONLY the name of the theme to apply.  Do not include any other text.
`,
});

const applyTenantThemeFlow = ai.defineFlow(
  {
    name: 'applyTenantThemeFlow',
    inputSchema: ApplyTenantThemeInputSchema,
    outputSchema: ApplyTenantThemeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
