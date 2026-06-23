
'use server';
/**
 * @fileOverview Generates dense revision sheets with mnemonics.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRevisionSheetInputSchema = z.object({
  topic: z.string().describe('The topic or notes.'),
  subject: z.string().optional().describe('The subject field.'),
});
export type GenerateRevisionSheetInput = z.infer<typeof GenerateRevisionSheetInputSchema>;

const GenerateRevisionSheetOutputSchema = z.object({
  quickNotes: z.string().describe('Concise revision summary.'),
  formulasAndDefinitions: z.array(z.string()).describe('Key formulas or definitions.'),
  mnemonics: z.array(z.string()).describe('Memory shortcuts.'),
  lastMinuteChecklist: z.array(z.string()).describe('5 bullet points to check before entering the hall.'),
});
export type GenerateRevisionSheetOutput = z.infer<typeof GenerateRevisionSheetOutputSchema>;

export async function generateRevisionSheet(input: GenerateRevisionSheetInput): Promise<GenerateRevisionSheetOutput> {
  return generateRevisionSheetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRevisionSheetPrompt',
  input: {schema: GenerateRevisionSheetInputSchema},
  output: {schema: GenerateRevisionSheetOutputSchema},
  prompt: `Create a dense, high-value one-page revision sheet for the subject: {{{subject}}}. 
Include mnemonics and a last-minute checklist.

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
