
import { db } from "./firebase";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  increment,
  Timestamp,
  orderBy,
  deleteDoc,
  limit
} from "firebase/firestore";

// --- User & Referral Services ---

export interface UserProfile {
  uid: string;
  name: string | null;
  email: string | null;
  plan: "free" | "pro" | "premium";
  createdAt: Timestamp;
  referralCode: string;
  referredBy?: string;
  premiumUntil?: Timestamp;
  onboardingCompleted?: boolean;
  // Subscription metadata
  billingStatus?: 'active' | 'expired' | 'trial';
  subscriptionId?: string;
  paymentId?: string;
  lastPaymentDate?: Timestamp;
}

export async function createUserProfile(uid: string, data: Partial<UserProfile>, referredByCode?: string) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  
  if (!snap.exists()) {
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    let referredByUid = "";
    
    if (referredByCode) {
      const q = query(collection(db, "users"), where("referralCode", "==", referredByCode));
      const refSnap = await getDocs(q);
      if (!refSnap.empty) {
        referredByUid = refSnap.docs[0].id;
        await addDoc(collection(db, "referrals"), {
          referrerUid: referredByUid,
          referredUid: uid,
          createdAt: serverTimestamp(),
          rewardGranted: false
        });
      }
    }

    const profile: UserProfile = {
      uid,
      name: data.name || "Student",
      email: data.email || "",
      plan: "free",
      createdAt: Timestamp.now(),
      referralCode,
      onboardingCompleted: false,
      ...(referredByUid && { referredBy: referredByUid })
    };
    await setDoc(userRef, profile);
    return profile;
  }
  return snap.data() as UserProfile;
}

export async function updateOnboardingStatus(uid: string) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { onboardingCompleted: true });
}

export async function updateUserPlan(uid: string, plan: "pro" | "premium", paymentId: string) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    plan,
    billingStatus: 'active',
    paymentId,
    lastPaymentDate: serverTimestamp()
  });
}

// --- Document & Caching Services ---

export interface StudyDocument {
  id?: string;
  uid: string;
  featureType: "summarize" | "answer" | "questions" | "revision";
  title: string;
  inputText: string;
  outputText: any;
  createdAt: Timestamp;
  cachedHash: string;
  isPremiumOutput: boolean;
  subject?: string;
  answerMode?: string;
  isExamBooster?: boolean;
  isFavorite?: boolean;
}

export function generateHash(text: string, type: string, extra?: string) {
  const combined = `${type}:${text.trim().toLowerCase()}:${extra || ''}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

export async function findCachedDocument(uid: string, hash: string) {
  const q = query(
    collection(db, "documents"), 
    where("uid", "==", uid), 
    where("cachedHash", "==", hash),
    limit(1)
  );
  const snap = await getDocs(q);
  if (!snap.empty) return { id: snap.docs[0].id, ...snap.docs[0].data() } as StudyDocument;
  return null;
}

export async function saveDocument(docData: Omit<StudyDocument, "createdAt">) {
  return await addDoc(collection(db, "documents"), {
    ...docData,
    createdAt: serverTimestamp()
  });
}

export async function deleteDocument(id: string) {
  await deleteDoc(doc(db, "documents", id));
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
  const docRef = doc(db, "documents", id);
  await updateDoc(docRef, { isFavorite });
}

export async function getUserDocuments(uid: string, filters?: { featureType?: string, search?: string, favoritesOnly?: boolean }) {
  let q = query(collection(db, "documents"), where("uid", "==", uid), orderBy("createdAt", "desc"));
  
  const snap = await getDocs(q);
  let results = snap.docs.map(d => ({ id: d.id, ...d.data() })) as StudyDocument[];

  if (filters?.featureType) {
    results = results.filter(d => d.featureType === filters.featureType);
  }
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    results = results.filter(d => d.title.toLowerCase().includes(s));
  }
  if (filters?.favoritesOnly) {
    results = results.filter(d => d.isFavorite);
  }
  
  return results;
}
