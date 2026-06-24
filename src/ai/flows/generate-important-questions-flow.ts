
'use server';
/**
 * @fileOverview Identifies high-probability exam questions based on topic depth.
 */

import {ai, assertApiKey} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImportantQuestionsInputSchema = z.object({
  chapterNotes: z.string().describe('The chapter notes or topic.'),
  subject: z.string().optional().describe('Subject field.'),
  isExamBooster: z.boolean().optional().describe('Whether to apply elite prediction patterns.'),
});
export type GenerateImportantQuestionsInput = z.infer<typeof GenerateImportantQuestionsInputSchema>;

const GenerateImportantQuestionsOutputSchema = z.object({
  predictionConfidence: z.enum(['low', 'medium', 'high']).describe('Honest confidence level in the predictions based on input depth.'),
  twoMarkQuestions: z.array(z.string()).describe('5 Short definition-based questions.'),
  fiveMarkQuestions: z.array(z.string()).describe('5 Medium explanatory questions.'),
  tenMarkQuestions: z.array(z.string()).describe('3 Essay/analytical questions.'),
  mostProbable: z.array(z.string()).describe('The questions MOST likely to appear in university papers.'),
  vivaQuestions: z.array(z.string()).describe('5 oral exam preparation questions.'),
});
export type GenerateImportantQuestionsOutput = z.infer<typeof GenerateImportantQuestionsOutputSchema>;

export async function generateImportantQuestions(input: GenerateImportantQuestionsInput): Promise<GenerateImportantQuestionsOutput> {
  assertApiKey();
  return generateImportantQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImportantQuestionsPrompt',
  input: {schema: GenerateImportantQuestionsInputSchema},
  output: {schema: GenerateImportantQuestionsOutputSchema},
  prompt: `Analyze the notes and predict high-probability questions for the subject: {{{subject}}}.

Constraint: If the input notes are very short or vague, set predictionConfidence to 'low' and generate broader topic-based questions.

Categorization:
- 2 Marks: Identification/Definition.
- 5 Marks: Comparison/Process explanation.
- 10 Marks: Detailed derivation, essay, or case-study.
- Viva: Questions a professor asks during practicals.

{{#if isExamBooster}}
Elite Mode: Use patterns from common university marking schemes to identify "Top Picks" that professors favor.
{{/if}}

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
