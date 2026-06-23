'use server';
/**
 * @fileOverview A Genkit flow for generating important exam questions from chapter notes.
 *
 * - generateImportantQuestions - A function that generates exam questions from provided chapter notes.
 * - GenerateImportantQuestionsInput - The input type for the generateImportantQuestions function.
 * - GenerateImportantQuestionsOutput - The return type for the generateImportantQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImportantQuestionsInputSchema = z.object({
  chapterNotes: z.string().describe('The chapter notes from which to generate exam questions.'),
});
export type GenerateImportantQuestionsInput = z.infer<typeof GenerateImportantQuestionsInputSchema>;

const GenerateImportantQuestionsOutputSchema = z.object({
  twoMarkQuestions: z.array(z.string()).describe('A list of probable 2-mark exam questions.'),
  fiveMarkQuestions: z.array(z.string()).describe('A list of probable 5-mark exam questions.'),
  tenMarkQuestions: z.array(z.string()).describe('A list of probable 10-mark exam questions.'),
});
export type GenerateImportantQuestionsOutput = z.infer<typeof GenerateImportantQuestionsOutputSchema>;

export async function generateImportantQuestions(input: GenerateImportantQuestionsInput): Promise<GenerateImportantQuestionsOutput> {
  return generateImportantQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImportantQuestionsPrompt',
  input: {schema: GenerateImportantQuestionsInputSchema},
  output: {schema: GenerateImportantQuestionsOutputSchema},
  prompt: `You are an expert educator, specializing in identifying key concepts and formulating probable exam questions from study material.

Your task is to analyze the provided chapter notes and generate a list of the most probable exam questions, categorized by their approximate mark values (2-mark, 5-mark, 10-mark).

Ensure the questions cover a range of difficulty and important topics from the notes.

Chapter Notes:
{{chapterNotes}}

`,
});

const generateImportantQuestionsFlow = ai.defineFlow(
  {
    name: 'generateImportantQuestionsFlow',
    inputSchema: GenerateImportantQuestionsInputSchema,
    outputSchema: GenerateImportantQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
