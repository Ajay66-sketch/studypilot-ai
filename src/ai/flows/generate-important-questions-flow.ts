
'use server';
/**
 * @fileOverview Identifies high-probability exam and viva questions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImportantQuestionsInputSchema = z.object({
  chapterNotes: z.string().describe('The chapter notes or topic.'),
  subject: z.string().optional().describe('Subject field (e.g. Computer Science).'),
});
export type GenerateImportantQuestionsInput = z.infer<typeof GenerateImportantQuestionsInputSchema>;

const GenerateImportantQuestionsOutputSchema = z.object({
  twoMarkQuestions: z.array(z.string()).describe('5 Short 2-mark questions.'),
  fiveMarkQuestions: z.array(z.string()).describe('5 Medium 5-mark questions.'),
  tenMarkQuestions: z.array(z.string()).describe('3 Essay 10-mark questions.'),
  mostProbable: z.array(z.string()).describe('The 3 questions MOST likely to appear based on patterns.'),
  vivaQuestions: z.array(z.string()).describe('5 oral/viva preparation questions.'),
});
export type GenerateImportantQuestionsOutput = z.infer<typeof GenerateImportantQuestionsOutputSchema>;

export async function generateImportantQuestions(input: GenerateImportantQuestionsInput): Promise<GenerateImportantQuestionsOutput> {
  return generateImportantQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImportantQuestionsPrompt',
  input: {schema: GenerateImportantQuestionsInputSchema},
  output: {schema: GenerateImportantQuestionsOutputSchema},
  prompt: `Analyze the provided notes and predict high-probability exam questions for the subject: {{{subject}}}.

Focus on concepts that are traditionally favored in university semesters.

Categorization:
- 2 Marks: Definition-based or identification questions.
- 5 Marks: Explanatory or comparison questions.
- 10 Marks: Long analytical or derivation questions.
- Viva: Questions a professor might ask during practicals or oral exams.

Notes:
{{{chapterNotes}}}`,
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
