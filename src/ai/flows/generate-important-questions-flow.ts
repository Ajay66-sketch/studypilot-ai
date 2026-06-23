
'use server';
/**
 * @fileOverview Identifies probable exam questions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImportantQuestionsInputSchema = z.object({
  chapterNotes: z.string().describe('The chapter notes or topic.'),
});
export type GenerateImportantQuestionsInput = z.infer<typeof GenerateImportantQuestionsInputSchema>;

const GenerateImportantQuestionsOutputSchema = z.object({
  twoMarkQuestions: z.array(z.string()).describe('5 probable 2-mark questions.'),
  fiveMarkQuestions: z.array(z.string()).describe('5 probable 5-mark questions.'),
  tenMarkQuestions: z.array(z.string()).describe('3 probable 10-mark questions.'),
});
export type GenerateImportantQuestionsOutput = z.infer<typeof GenerateImportantQuestionsOutputSchema>;

export async function generateImportantQuestions(input: GenerateImportantQuestionsInput): Promise<GenerateImportantQuestionsOutput> {
  return generateImportantQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImportantQuestionsPrompt',
  input: {schema: GenerateImportantQuestionsInputSchema},
  output: {schema: GenerateImportantQuestionsOutputSchema},
  prompt: `Analyze the notes and predict the most likely exam questions. 
Categorize them exactly into 5 for 2 marks, 5 for 5 marks, and 3 for 10 marks.

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
