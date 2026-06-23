
'use server';
/**
 * @fileOverview Generates structured exam-ready answers with modes.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateExamAnswerInputSchema = z.object({
  questionOrTopic: z.string().describe('The question or topic.'),
  subject: z.string().optional().describe('The subject field.'),
  answerMode: z.enum(['short', 'medium', 'long', 'bullet']).default('medium').describe('The length/style of the answer.'),
  isExamBooster: z.boolean().optional().describe('Whether to apply exam scoring enhancements.'),
});
export type GenerateExamAnswerInput = z.infer<typeof GenerateExamAnswerInputSchema>;

const GenerateExamAnswerOutputSchema = z.object({
  title: z.string().describe('A suitable title for the answer.'),
  introduction: z.string().describe('Context setting.'),
  mainBody: z.string().describe('Structured core answer.'),
  conclusion: z.string().describe('Summary statement.'),
  keyTerms: z.array(z.string()).describe('Important terms used in the answer.'),
  examTip: z.string().describe('A pro-tip for writing this in an exam.'),
});
export type GenerateExamAnswerOutput = z.infer<typeof GenerateExamAnswerOutputSchema>;

export async function generateExamAnswer(input: GenerateExamAnswerInput): Promise<GenerateExamAnswerOutput> {
  return generateExamAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExamAnswerPrompt',
  input: { schema: GenerateExamAnswerInputSchema },
  output: { schema: GenerateExamAnswerOutputSchema },
  prompt: `Generate a professional, high-scoring exam answer for the topic: {{{questionOrTopic}}} in the subject: {{{subject}}}.
Style: {{{answerMode}}}.
{{#if isExamBooster}}Exam Booster Mode Active: Structure the answer with clear headings, sub-headings, and maximize scoring potential based on university standards.{{/if}}

Use simple but academic language. Ensure it fits the requested mode length.`,
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
