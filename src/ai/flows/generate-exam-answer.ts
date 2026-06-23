
'use server';
/**
 * @fileOverview Generates structured exam-ready answers.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateExamAnswerInputSchema = z.object({
  questionOrTopic: z.string().describe('The question or topic.'),
});
export type GenerateExamAnswerInput = z.infer<typeof GenerateExamAnswerInputSchema>;

const GenerateExamAnswerOutputSchema = z.object({
  introduction: z.string().describe('A clear setting of context.'),
  mainBody: z.string().describe('The core answer in student-friendly, easy-to-understand language.'),
  conclusion: z.string().describe('Summary statement.'),
  keywords: z.array(z.string()).describe('Exactly 3 important keywords to remember for this answer.'),
});
export type GenerateExamAnswerOutput = z.infer<typeof GenerateExamAnswerOutputSchema>;

export async function generateExamAnswer(input: GenerateExamAnswerInput): Promise<GenerateExamAnswerOutput> {
  return generateExamAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExamAnswerPrompt',
  input: { schema: GenerateExamAnswerInputSchema },
  output: { schema: GenerateExamAnswerOutputSchema },
  prompt: `You are an expert tutor. Generate a high-scoring exam answer for the given topic. 
Use simple language but ensure it is structured professionally with an intro, body, and conclusion.

Question/Topic: {{{questionOrTopic}}}`,
});

const generateExamAnswerFlow = ai.defineFlow(
  {
    name: 'generateExamAnswerFlow',
    inputSchema: GenerateExamAnswerInputSchema,
    outputSchema: GenerateExamAnswerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
