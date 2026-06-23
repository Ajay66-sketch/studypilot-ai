'use server';
/**
 * @fileOverview A Genkit flow that summarizes raw study notes into a concise summary,
 * key concepts, and important terms.
 *
 * - summarizeNotes - A function that handles the notes summarization process.
 * - SummarizeNotesInput - The input type for the summarizeNotes function.
 * - SummarizeNotesOutput - The return type for the summarizeNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNotesInputSchema = z.object({
  notes: z.string().describe('The raw study notes or paragraphs to be summarized.'),
});
export type SummarizeNotesInput = z.infer<typeof SummarizeNotesInputSchema>;

const SummarizeNotesOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the study notes.'),
  keyConcepts: z.array(z.string()).describe('A list of key concepts as bullet points.'),
  importantTerms: z.array(z.string()).describe('A list of important terms found in the notes.'),
});
export type SummarizeNotesOutput = z.infer<typeof SummarizeNotesOutputSchema>;

export async function summarizeNotes(input: SummarizeNotesInput): Promise<SummarizeNotesOutput> {
  return summarizeNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNotesPrompt',
  input: {schema: SummarizeNotesInputSchema},
  output: {schema: SummarizeNotesOutputSchema},
  prompt: `You are an AI assistant specialized in summarizing study notes for students.
Your task is to take the provided raw study notes and extract the most important information.

From the study notes, provide:
1. A concise summary that captures the main ideas.
2. A list of key concepts, presented as bullet points.
3. A list of important terms or vocabulary found in the notes.

Study Notes:
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
