import {
  saveDocument as saveDocApi,
  getUserDocuments as getDocsApi,
  deleteDocument as deleteDocApi,
  toggleFavorite as toggleFavApi,
  findCachedDocument as findCachedDocApi,
  generateHash,
  StudyDocument
} from '@/services/document-service';
import { completeOnboardingApi } from '@/services/auth-service';

export type { StudyDocument };
export { generateHash };

export async function createUserProfile(uid: string, data: any, referredByCode?: string) {
  // Handled automatically during backend registration/login
  return { uid, name: data.name, email: data.email, plan: 'free' };
}

export async function updateOnboardingStatus(uid: string) {
  await completeOnboardingApi();
}

export async function updateUserPlan(uid: string, plan: 'pro' | 'premium', paymentId: string) {
  // Handled automatically via backend billing verification
  return;
}

export async function findCachedDocument(uid: string, hash: string) {
  return await findCachedDocApi(hash);
}

export async function saveDocument(docData: any) {
  return await saveDocApi(docData);
}

export async function deleteDocument(id: string) {
  await deleteDocApi(id);
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
  await toggleFavApi(id, isFavorite);
}

export async function getUserDocuments(uid: string, filters?: { featureType?: string; search?: string; favoritesOnly?: boolean }) {
  return await getDocsApi(filters);
}
