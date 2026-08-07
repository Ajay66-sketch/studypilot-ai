import { z } from 'zod';

export const SummarizeSchema = z.object({
  notes: z.string().min(1, 'Notes text is required'),
  subject: z.string().optional(),
  isExamBooster: z.boolean().optional(),
});

export const ModelAnswerSchema = z.object({
  questionOrTopic: z.string().min(1, 'Question or topic is required'),
  subject: z.string().optional(),
  answerMode: z.enum(['short', 'medium', 'long', 'bullet']).default('medium'),
  isExamBooster: z.boolean().optional(),
});

export const QuestionsSchema = z.object({
  chapterNotes: z.string().min(1, 'Chapter notes are required'),
  subject: z.string().optional(),
  isExamBooster: z.boolean().optional(),
});

export const RevisionSchema = z.object({
  topic: z.string().min(1, 'Topic text is required'),
  subject: z.string().optional(),
  isExamBooster: z.boolean().optional(),
});
