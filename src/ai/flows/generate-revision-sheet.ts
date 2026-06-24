
'use server';
/**
 * @fileOverview Generates dense, high-value revision sheets for last-minute prep.
 */

import {ai, assertApiKey} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRevisionSheetInputSchema = z.object({
  topic: z.string().describe('The topic or notes.'),
  subject: z.string().optional().describe('The subject field.'),
  isExamBooster: z.boolean().optional().describe('Whether to apply elite revision depth.'),
});
export type GenerateRevisionSheetInput = z.infer<typeof GenerateRevisionSheetInputSchema>;

const GenerateRevisionSheetOutputSchema = z.object({
  quickNotes: z.string().describe('Dense summary for fast reading. Use **bold** heavily for keywords.'),
  formulasAndDefinitions: z.array(z.string()).describe('Key formulas or critical 1-sentence definitions.'),
  mnemonics: z.array(z.string()).describe('3-5 memory shortcuts. Only include if they feel natural and helpful.'),
  lastMinuteChecklist: z.array(z.string()).describe('5 tactical points (e.g. "Check sign convention").'),
  mustMemorizeSection: z.array(z.string()).describe('The absolute top 3 points that carry the most marks.'),
});
export type GenerateRevisionSheetOutput = z.infer<typeof GenerateRevisionSheetOutputSchema>;

export async function generateRevisionSheet(input: GenerateRevisionSheetInput): Promise<GenerateRevisionSheetOutput> {
  assertApiKey();
  return generateRevisionSheetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRevisionSheetPrompt',
  input: {schema: GenerateRevisionSheetInputSchema},
  output: {schema: GenerateRevisionSheetOutputSchema},
  prompt: `Create a one-page rapid revision pack for: {{{subject}}}. 

Design this for a student with 10 minutes left.

Requirements:
1. Keyword Bolding: Use **bold** heavily in the quickNotes section so keywords "pop".
2. Formulas: If the subject is Math/Engineering/Science, list the critical formulas first.
3. Mnemonics: Use natural, clever memory tricks. If a mnemonic is awkward, skip it and provide a simple "Recall Hook".
4. Must Memorize: Identify the 3 points that score the most marks.

{{#if isExamBooster}}
Elite Mode: Add "Common Exam Traps" (things students often get wrong in this topic).
{{/if}}

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
