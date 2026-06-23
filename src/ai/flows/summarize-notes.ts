
'use server';
/**
 * @fileOverview Summarizes raw study notes into a student-friendly format.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNotesInputSchema = z.object({
  notes: z.string().describe('The raw study notes to be summarized.'),
});
export type SummarizeNotesInput = z.infer<typeof SummarizeNotesInputSchema>;

const SummarizeNotesOutputSchema = z.object({
  shortSummary: z.string().describe('A 2-3 sentence summary of the main idea.'),
  bulletPoints: z.array(z.string()).describe('Key points from the notes in bullet form.'),
  keyConcepts: z.array(z.object({
    term: z.string(),
    explanation: z.string()
  })).describe('Critical terms and their concise explanations.'),
});
export type SummarizeNotesOutput = z.infer<typeof SummarizeNotesOutputSchema>;

export async function summarizeNotes(input: SummarizeNotesInput): Promise<SummarizeNotesOutput> {
  return summarizeNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNotesPrompt',
  input: {schema: SummarizeNotesInputSchema},
  output: {schema: SummarizeNotesOutputSchema},
  prompt: `You are a helpful student assistant. Summarize the following study notes clearly.
Ensure the bullet points are easy to memorize and the key concepts focus on exam-important terms.

Notes:
{{{notes}}}`,
});

const summarizeNotesFlow = ai.defineFlow(
  {
    name: 'summarizeNotesFlow',
    inputSchema: SummarizeNotesInputSchema,
    outputSchema: SummarizeNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
