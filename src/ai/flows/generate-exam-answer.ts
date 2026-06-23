
'use server';
/**
 * @fileOverview Generates structured, marks-aware exam answers for university students.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateExamAnswerInputSchema = z.object({
  questionOrTopic: z.string().describe('The question or topic.'),
  subject: z.string().optional().describe('The subject field (e.g. Physics, Law).'),
  answerMode: z.enum(['short', 'medium', 'long', 'bullet']).default('medium').describe('The length/style of the answer.'),
  isExamBooster: z.boolean().optional().describe('Whether to apply elite exam scoring enhancements.'),
});
export type GenerateExamAnswerInput = z.infer<typeof GenerateExamAnswerInputSchema>;

const GenerateExamAnswerOutputSchema = z.object({
  title: z.string().describe('A high-scoring academic title for the answer.'),
  introduction: z.string().describe('A context-setting 2-3 sentence introduction. Use **bold** for keywords.'),
  mainBody: z.string().describe('Structured core answer with clear points. Use **bold** for technical terms and key points.'),
  conclusion: z.string().describe('Final summary statement. Use **bold** for the closing logic.'),
  keyTerms: z.array(z.string()).describe('5-8 important academic keywords used.'),
  scoringKeywords: z.array(z.string()).describe('List of 3-5 specific technical terms a student MUST mention for full marks.'),
  diagramSuggestions: z.string().optional().describe('Brief description of a diagram or flowchart the student should draw to score higher.'),
  examTip: z.string().describe('A tactical scoring hint or "Common Mistakes" note.'),
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

Generate a professional model answer for: {{{questionOrTopic}}}.

Mark-Scheme Alignment (Indian University System):
- Mode Short: 2-3 Marks. Concise definition and 1 key point.
- Mode Medium: 5 Marks. Clear Intro, 3-4 structured points, and Conclusion.
- Mode Long: 10-15 Marks. Detailed Intro, multiple sub-headings, deep analysis, and Conclusion.
- Mode Bullet: Structured list of high-impact points.

Requirements:
1. Keyword Bolding: Automatically use **bold** for critical terms, formulas, and laws inside sentences.
2. Technical Depth: If the subject is technical (Math, CS, Physics), preserve exact terminology and formulas. Do not oversimplify.
3. Scoring Keywords: Identify the specific terms an evaluator looks for.
4. Diagram Suggestion: If applicable to the topic, suggest what figure to draw.
5. Elite Enhancements: {{#if isExamBooster}}Apply "Exam Booster Mode". Add a "Common Mistakes to Avoid" section and extra technical sub-points for the highest grade.{{else}}Standard professional academic style.{{/if}}

Output must feel like a premium study sheet.`,
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
