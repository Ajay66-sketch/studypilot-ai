
'use server';
/**
 * @fileOverview Summarizes raw notes into exam-focused, structured material.
 */

import {ai, assertApiKey} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNotesInputSchema = z.object({
  notes: z.string().describe('The raw study notes to be summarized.'),
  subject: z.string().optional().describe('The subject field.'),
  isExamBooster: z.boolean().optional().describe('Whether to apply elite exam-specific patterns.'),
});
export type SummarizeNotesInput = z.infer<typeof SummarizeNotesInputSchema>;

const SummarizeNotesOutputSchema = z.object({
  shortSummary: z.string().describe('A 3-5 line high-level summary. Use **bold** for key concepts.'),
  bulletPoints: z.array(z.string()).describe('10-15 high-impact study bullet points. Use **bold** for terms.'),
  keyConcepts: z.array(z.object({
    term: z.string(),
    explanation: z.string()
  })).describe('Critical academic terms and their explanations.'),
  examHighlights: z.string().describe('Section explaining the "must-remember" logic and common exam questions from this topic.'),
  quickRevisionBlock: z.string().describe('A 2-sentence ultra-short revision hook for 1 minute before the exam.'),
});
export type SummarizeNotesOutput = z.infer<typeof SummarizeNotesOutputSchema>;

export async function summarizeNotes(input: SummarizeNotesInput): Promise<SummarizeNotesOutput> {
  assertApiKey();
  return summarizeNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNotesPrompt',
  input: {schema: SummarizeNotesInputSchema},
  output: {schema: SummarizeNotesOutputSchema},
  prompt: `You are a professional study strategist for university exams. 

Summarize the study notes for: {{{subject}}}.

Goal: Transform messy content into high-value material that stands out visually.

Technical Subjects Rule (Math, Physics, Engineering, CS):
- Do NOT oversimplify.
- Preserve formulas, theorems, and technical definitions exactly.
- Use **bold** for technical keywords.

Requirements:
1. Bullet Notes: Use dense, academic-style points. Use **bold** within bullets for keywords.
2. Exam Highlights: Specifically explain how this topic usually appears in exams (e.g. "Usually asked as a 5-mark comparison").
3. Quick Revision: A tiny block for 1-minute recall.

{{#if isExamBooster}}
Exam Booster Mode: ACTIVE. Add "Commonly Confused Terms" and emphasize keywords that carry the most weight in university scoring.
{{else}}
Standard Mode: Ensure academic clarity and structure.
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
