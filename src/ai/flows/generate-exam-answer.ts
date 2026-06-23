'use server';
/**
 * @fileOverview A Genkit flow that generates structured exam-ready answers.
 *
 * - generateExamAnswer - A function that handles the generation of an exam answer.
 * - GenerateExamAnswerInput - The input type for the generateExamAnswer function.
 * - GenerateExamAnswerOutput - The return type for the generateExamAnswer function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const GenerateExamAnswerInputSchema = z.object({
  questionOrTopic: z.string().describe('The question or topic for which to generate an exam-ready answer.'),
});
export type GenerateExamAnswerInput = z.infer<typeof GenerateExamAnswerInputSchema>;

// Output Schema
const GenerateExamAnswerOutputSchema = z.object({
  introduction: z.string().describe('A concise introduction to the answer.'),
  body: z.string().describe('The main body of the answer, covering key points in detail.'),
  conclusion: z.string().describe('A summary or concluding statement for the answer.'),
});
export type GenerateExamAnswerOutput = z.infer<typeof GenerateExamAnswerOutputSchema>;

// Wrapper function
export async function generateExamAnswer(input: GenerateExamAnswerInput): Promise<GenerateExamAnswerOutput> {
  return generateExamAnswerFlow(input);
}

// Genkit Prompt Definition
const prompt = ai.definePrompt({
  name: 'generateExamAnswerPrompt',
  input: { schema: GenerateExamAnswerInputSchema },
  output: { schema: GenerateExamAnswerOutputSchema },
  prompt: `You are an AI assistant specialized in creating structured, exam-ready answers from a given question or topic.
Your goal is to provide a comprehensive answer that includes a clear introduction, detailed body, and a strong conclusion, all written in simple, easy-to-understand language suitable for students preparing for exams.

Generate an exam-ready answer for the following:

Question/Topic: {{{questionOrTopic}}}

Please ensure the output strictly adheres to the JSON format provided in the output schema, with distinct sections for 'introduction', 'body', and 'conclusion'.`,
});

// Genkit Flow Definition
const generateExamAnswerFlow = ai.defineFlow(
  {
    name: 'generateExamAnswerFlow',
    inputSchema: GenerateExamAnswerInputSchema,
    outputSchema: GenerateExamAnswerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate exam answer output.');
    }
    return output;
  }
);
