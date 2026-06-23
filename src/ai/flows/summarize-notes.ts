
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
  prompt: `You are a professional study strategist for university exams in India. 

Summarize the following study notes for the subject: {{{subject}}}.

Goal: Transform messy, dense information into high-value, revisable study material.

Requirements:
1. Short Summary: Provide a 3-5 line plain-English overview of the entire topic.
2. Bullet Notes: Use dense, academic-style bullet points that cover 100% of the core logic.
3. Key Concepts: Extract the most important technical terms and provide clear 1-sentence definitions.
4. Exam Highlights: A special "Scoring Tip" section explaining what professors specifically look for in this topic.

{{#if isExamBooster}}
Exam Booster Mode: ACTIVE. Focus heavily on keywords that carry high marks in university scoring systems. Use a more formal, academic tone.
{{else}}
Standard Mode: Ensure clarity and student-friendly language.
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
