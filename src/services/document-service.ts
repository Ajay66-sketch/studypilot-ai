import { apiClient } from '../lib/api-client';

export interface StudyDocument {
  id: string;
  userId: string;
  featureType: 'summarize' | 'answer' | 'questions' | 'revision';
  title: string;
  inputText: string;
  outputText: any;
  createdAt: string;
  cachedHash: string;
  isPremiumOutput: boolean;
  subject?: string;
  answerMode?: string;
  isExamBooster?: boolean;
  isFavorite?: boolean;
}

export function generateHash(text: string, type: string, extra?: string): string {
  const normalizedText = text.trim().replace(/\s+/g, ' ').toLowerCase();
  const combined = `${type}:${normalizedText}:${extra || ''}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

export async function saveDocument(docData: Omit<StudyDocument, 'id' | 'userId' | 'createdAt'>): Promise<StudyDocument> {
  const response = await apiClient.post('/api/documents', docData);
  return response.data.document;
}

export async function getUserDocuments(filters?: { featureType?: string; search?: string; favoritesOnly?: boolean }): Promise<StudyDocument[]> {
  const params: any = {};
  if (filters?.featureType) params.featureType = filters.featureType;
  if (filters?.search) params.search = filters.search;
  if (filters?.favoritesOnly) params.favoritesOnly = 'true';

  const response = await apiClient.get('/api/documents', { params });
  return response.data.documents;
}

export async function getDocumentById(id: string): Promise<StudyDocument> {
  const response = await apiClient.get(`/api/documents/${id}`);
  return response.data.document;
}

export async function deleteDocument(id: string): Promise<void> {
  await apiClient.delete(`/api/documents/${id}`);
}

export async function toggleFavorite(id: string, isFavorite: boolean): Promise<StudyDocument> {
  const response = await apiClient.put(`/api/documents/${id}`, { isFavorite });
  return response.data.document;
}

export async function findCachedDocument(hash: string): Promise<StudyDocument | null> {
  const response = await apiClient.get('/api/documents/cache', { params: { hash } });
  return response.data.document;
}
