import { z } from 'zod';

export const CreateDocumentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  featureType: z.enum(['summarize', 'answer', 'questions', 'revision']),
  subject: z.string().optional(),
  answerMode: z.string().optional(),
  isExamBooster: z.boolean().default(false),
  isFavorite: z.boolean().default(false),
  inputText: z.string().min(1, 'Input text is required'),
  outputText: z.any(),
  cachedHash: z.string(),
  isPremiumOutput: z.boolean().default(false),
});

export const UpdateDocumentSchema = z.object({
  title: z.string().optional(),
  isFavorite: z.boolean().optional(),
  subject: z.string().optional(),
});

export type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof UpdateDocumentSchema>;
