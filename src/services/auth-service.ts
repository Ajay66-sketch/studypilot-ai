import { apiClient } from '../lib/api-client';

export interface User {
  id: string;
  uid: string;
  email: string;
  name: string | null;
  displayName: string | null;
  photoURL?: string | null;
  plan: 'free' | 'pro' | 'premium';
  referralCode: string;
  onboardingCompleted: boolean;
  billingStatus?: 'active' | 'expired' | 'trial';
  createdAt?: string;
}

function normalizeUser(rawUser: any): User {
  if (!rawUser) return rawUser;
  return {
    ...rawUser,
    uid: rawUser.id,
    displayName: rawUser.name || 'Student',
  };
}

export async function registerApi(data: { email: string; password: string; name: string; referralCode?: string }): Promise<User> {
  const response = await apiClient.post('/api/auth/register', data);
  return normalizeUser(response.data.user);
}

export async function loginApi(data: { email: string; password: string }): Promise<User> {
  const response = await apiClient.post('/api/auth/login', data);
  return normalizeUser(response.data.user);
}

export async function logoutApi(): Promise<void> {
  await apiClient.post('/api/auth/logout');
}

export async function getMeApi(): Promise<User | null> {
  try {
    const response = await apiClient.get('/api/auth/me');
    return normalizeUser(response.data.user);
  } catch {
    return null;
  }
}

export async function completeOnboardingApi(): Promise<void> {
  await apiClient.post('/api/auth/onboarding');
}
