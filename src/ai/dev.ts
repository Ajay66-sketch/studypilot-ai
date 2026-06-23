import { config } from 'dotenv';
config();

import '@/ai/flows/generate-revision-sheet.ts';
import '@/ai/flows/generate-important-questions-flow.ts';
import '@/ai/flows/summarize-notes.ts';
import '@/ai/flows/generate-exam-answer.ts';