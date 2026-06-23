
'use server';
/**
 * @fileOverview Generates quick revision sheets.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRevisionSheetInputSchema = z.object({
  topic: z.string().describe('The topic or notes.'),
});
export type GenerateRevisionSheetInput = z.infer<typeof GenerateRevisionSheetInputSchema>;

const GenerateRevisionSheetOutputSchema = z.object({
  quickNotes: z.string().describe('One-page style quick revision notes.'),
  formulasAndDefinitions: z.array(z.string()).describe('Key formulas or specific definitions.'),
  mnemonics: z.array(z.string()).describe('Memory shortcuts or mnemonics.'),
});
export type GenerateRevisionSheetOutput = z.infer<typeof GenerateRevisionSheetOutputSchema>;

export async function generateRevisionSheet(input: GenerateRevisionSheetInput): Promise<GenerateRevisionSheetOutput> {
  return generateRevisionSheetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRevisionSheetPrompt',
  input: {schema: GenerateRevisionSheetInputSchema},
  output: {schema: GenerateRevisionSheetOutputSchema},
  prompt: `Create a dense, high-value revision sheet. 
Include mnemonics to help students memorize fast and list any crucial formulas or definitions.

Topic/Notes:
{{{topic}}}`,
});

const generateRevisionSheetFlow = ai.defineFlow(
  {
    name: 'generateRevisionSheetFlow',
    inputSchema: GenerateRevisionSheetInputSchema,
    outputSchema: GenerateRevisionSheetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
