
'use server';
/**
 * @fileOverview Identifies probable exam questions including viva.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImportantQuestionsInputSchema = z.object({
  chapterNotes: z.string().describe('The chapter notes or topic.'),
  subject: z.string().optional().describe('Subject field.'),
});
export type GenerateImportantQuestionsInput = z.infer<typeof GenerateImportantQuestionsInputSchema>;

const GenerateImportantQuestionsOutputSchema = z.object({
  twoMarkQuestions: z.array(z.string()).describe('Short 2-mark questions.'),
  fiveMarkQuestions: z.array(z.string()).describe('Medium 5-mark questions.'),
  tenMarkQuestions: z.array(z.string()).describe('Essay 10-mark questions.'),
  mostProbable: z.array(z.string()).describe('The 3 questions most likely to appear in the exam.'),
  vivaQuestions: z.array(z.string()).describe('3-5 oral/viva questions.'),
});
export type GenerateImportantQuestionsOutput = z.infer<typeof GenerateImportantQuestionsOutputSchema>;

export async function generateImportantQuestions(input: GenerateImportantQuestionsInput): Promise<GenerateImportantQuestionsOutput> {
  return generateImportantQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImportantQuestionsPrompt',
  input: {schema: GenerateImportantQuestionsInputSchema},
  output: {schema: GenerateImportantQuestionsOutputSchema},
  prompt: `Analyze the notes and predict the most likely exam questions for the subject: {{{subject}}}. 
Categorize them by marks and include a viva section.

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
