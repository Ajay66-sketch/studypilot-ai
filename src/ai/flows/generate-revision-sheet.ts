
'use server';
/**
 * @fileOverview Generates concise revision sheets with memory hacks.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRevisionSheetInputSchema = z.object({
  topic: z.string().describe('The topic or notes.'),
  subject: z.string().optional().describe('The subject field.'),
});
export type GenerateRevisionSheetInput = z.infer<typeof GenerateRevisionSheetInputSchema>;

const GenerateRevisionSheetOutputSchema = z.object({
  quickNotes: z.string().describe('Dense revision summary for fast reading.'),
  formulasAndDefinitions: z.array(z.string()).describe('Key formulas or critical definitions.'),
  mnemonics: z.array(z.string()).describe('3-5 memory shortcuts/acronyms.'),
  lastMinuteChecklist: z.array(z.string()).describe('5 bullet points to check before entering the exam hall.'),
});
export type GenerateRevisionSheetOutput = z.infer<typeof GenerateRevisionSheetOutputSchema>;

export async function generateRevisionSheet(input: GenerateRevisionSheetInput): Promise<GenerateRevisionSheetOutput> {
  return generateRevisionSheetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRevisionSheetPrompt',
  input: {schema: GenerateRevisionSheetInputSchema},
  output: {schema: GenerateRevisionSheetOutputSchema},
  prompt: `Create a dense, high-value one-page revision pack for the subject: {{{subject}}}. 

Design this for a student who has 15 minutes before the exam starts.

Include:
1. Mnemonics: Creative memory tricks to remember lists or complex processes.
2. Checklist: Tactical points (e.g. "Check sign convention", "Don't forget the units").
3. Formulas/Definitions: The "must-knows".

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
