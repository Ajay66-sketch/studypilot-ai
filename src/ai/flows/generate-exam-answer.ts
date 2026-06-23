
'use server';
/**
 * @fileOverview Generates structured exam-ready answers with depth and context.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateExamAnswerInputSchema = z.object({
  questionOrTopic: z.string().describe('The question or topic.'),
  subject: z.string().optional().describe('The subject field (e.g. Physics, Law).'),
  answerMode: z.enum(['short', 'medium', 'long', 'bullet']).default('medium').describe('The length/style of the answer.'),
  isExamBooster: z.boolean().optional().describe('Whether to apply exam scoring enhancements.'),
});
export type GenerateExamAnswerInput = z.infer<typeof GenerateExamAnswerInputSchema>;

const GenerateExamAnswerOutputSchema = z.object({
  title: z.string().describe('A high-scoring academic title for the answer.'),
  introduction: z.string().describe('A context-setting 2-3 sentence introduction.'),
  mainBody: z.string().describe('Structured core answer with clear explanation points.'),
  conclusion: z.string().describe('Final summary statement to wrap up the points.'),
  keyTerms: z.array(z.string()).describe('5-8 important academic keywords used.'),
  examTip: z.string().describe('A pro-tip for high scores in the university hall.'),
});
export type GenerateExamAnswerOutput = z.infer<typeof GenerateExamAnswerOutputSchema>;

export async function generateExamAnswer(input: GenerateExamAnswerInput): Promise<GenerateExamAnswerOutput> {
  return generateExamAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExamAnswerPrompt',
  input: { schema: GenerateExamAnswerInputSchema },
  output: { schema: GenerateExamAnswerOutputSchema },
  prompt: `You are an expert university professor specializing in high-scoring exam writing for the subject: {{{subject}}}.

Generate a professional, structured exam answer for the topic: {{{questionOrTopic}}}.

Style Configuration:
- Mode: {{{answerMode}}} (Short = 2 Marks, Medium = 5 Marks, Long = 10 Marks, Bullet = Points only).
- Exam Booster: {{#if isExamBooster}}ACTIVE. Structure the answer with academic headings, sub-headings, and maximize scoring potential based on Indian university patterns.{{else}}Standard. Ensure clarity and correct structure.{{/if}}

Requirements:
1. Use simple but academic English.
2. Ensure the "Main Answer Body" is detailed according to the requested mode.
3. The "Exam Tip" should be a real tactical hint for writing this answer in a physical exam (e.g. "Draw a diagram of X", "Mention Case Law Y").`,
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
