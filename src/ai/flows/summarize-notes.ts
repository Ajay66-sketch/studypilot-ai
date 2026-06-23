
'use server';
/**
 * @fileOverview Summarizes raw notes into exam-focused bullet points.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNotesInputSchema = z.object({
  notes: z.string().describe('The raw study notes to be summarized.'),
  subject: z.string().optional().describe('The subject field.'),
  isExamBooster: z.boolean().optional().describe('Whether to apply exam-specific patterns.'),
});
export type SummarizeNotesInput = z.infer<typeof SummarizeNotesInputSchema>;

const SummarizeNotesOutputSchema = z.object({
  shortSummary: z.string().describe('A 3-5 line high-level summary.'),
  bulletPoints: z.array(z.string()).describe('10-15 high-impact study bullet points.'),
  keyConcepts: z.array(z.object({
    term: z.string(),
    explanation: z.string()
  })).describe('Critical academic terms and their explanations.'),
  examHighlights: z.string().describe('Section explaining the "must-remember" logic for exams.'),
});
export type SummarizeNotesOutput = z.infer<typeof SummarizeNotesOutputSchema>;

export async function summarizeNotes(input: SummarizeNotesInput): Promise<SummarizeNotesOutput> {
  return summarizeNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNotesPrompt',
  input: {schema: SummarizeNotesInputSchema},
  output: {schema: SummarizeNotesOutputSchema},
  prompt: `You are a professional study strategist. Summarize the following study notes for the subject: {{{subject}}}.

Goal: Turn raw information into clear, revisable study notes.

{{#if isExamBooster}}
Exam Booster Mode: ACTIVE. Focus heavily on scoring-relevant points, recurring exam patterns, and concise definitions.
{{else}}
Standard Mode: Ensure academic clarity and comprehensive coverage of points.
{{/if}}

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
