import { apiClient } from '../lib/api-client';

export async function summarizeNotesApi(input: { notes: string; subject?: string; isExamBooster?: boolean }) {
  const response = await apiClient.post('/api/ai/summary', input);
  return response.data.result;
}

export async function generateExamAnswerApi(input: { questionOrTopic: string; subject?: string; answerMode?: 'short' | 'medium' | 'long' | 'bullet'; isExamBooster?: boolean }) {
  const response = await apiClient.post('/api/ai/model-answer', input);
  return response.data.result;
}

export async function generateImportantQuestionsApi(input: { chapterNotes: string; subject?: string; isExamBooster?: boolean }) {
  const response = await apiClient.post('/api/ai/questions', input);
  return response.data.result;
}

export async function generateRevisionSheetApi(input: { topic: string; subject?: string; isExamBooster?: boolean }) {
  const response = await apiClient.post('/api/ai/revision', input);
  return response.data.result;
}

export async function getUsageApi(): Promise<{ used: number; remaining: number; limit: number; plan: string }> {
  const response = await apiClient.get('/api/ai/usage');
  return response.data;
}
