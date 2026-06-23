'use server';
/**
 * @fileOverview A Genkit flow for generating one-page revision sheets from a given topic.
 *
 * - generateRevisionSheet - A function that handles the revision sheet generation process.
 * - GenerateRevisionSheetInput - The input type for the generateRevisionSheet function.
 * - GenerateRevisionSheetOutput - The return type for the generateRevisionSheet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRevisionSheetInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate a revision sheet.'),
});
export type GenerateRevisionSheetInput = z.infer<typeof GenerateRevisionSheetInputSchema>;

const GenerateRevisionSheetOutputSchema = z.object({
  revisionSheet: z.string().describe('A comprehensive one-page revision sheet.'),
});
export type GenerateRevisionSheetOutput = z.infer<typeof GenerateRevisionSheetOutputSchema>;

export async function generateRevisionSheet(input: GenerateRevisionSheetInput): Promise<GenerateRevisionSheetOutput> {
  return generateRevisionSheetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRevisionSheetPrompt',
  input: {schema: GenerateRevisionSheetInputSchema},
  output: {schema: GenerateRevisionSheetOutputSchema},
  prompt: `You are an expert academic assistant.

Generate a comprehensive, one-page revision sheet for the following topic. The revision sheet should summarize the essential information, key concepts, and important points for quick review. Format the output clearly with headings, bullet points, and concise explanations. Ensure it is suitable for a student preparing for an exam.

Topic: {{{topic}}}`,
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
