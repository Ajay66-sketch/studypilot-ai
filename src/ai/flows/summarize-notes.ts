
'use server';
/**
 * @fileOverview Summarizes raw study notes into a professional student-friendly format.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNotesInputSchema = z.object({
  notes: z.string().describe('The raw study notes to be summarized.'),
  subject: z.string().optional().describe('The subject or field of study.'),
  isExamBooster: z.boolean().optional().describe('Whether to focus on exam-specific patterns.'),
});
export type SummarizeNotesInput = z.infer<typeof SummarizeNotesInputSchema>;

const SummarizeNotesOutputSchema = z.object({
  shortSummary: z.string().describe('A 3-5 line plain summary.'),
  bulletPoints: z.array(z.string()).describe('Key points from the notes in bullet form.'),
  keyConcepts: z.array(z.object({
    term: z.string(),
    explanation: z.string()
  })).describe('Critical terms and their concise explanations.'),
  examHighlights: z.string().describe('Section explaining what to remember specifically for the exam.'),
});
export type SummarizeNotesOutput = z.infer<typeof SummarizeNotesOutputSchema>;

export async function summarizeNotes(input: SummarizeNotesInput): Promise<SummarizeNotesOutput> {
  return summarizeNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNotesPrompt',
  input: {schema: SummarizeNotesInputSchema},
  output: {schema: SummarizeNotesOutputSchema},
  prompt: `You are a professional study assistant. Summarize the following study notes for the subject: {{{subject}}}.
Ensure the bullet points are high-impact and the exam highlights focus on university patterns.
{{#if isExamBooster}}Apply Exam Booster mode: Focus heavily on highly probable patterns and structured clarity for scoring high.{{/if}}

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
