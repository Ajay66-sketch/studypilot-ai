
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
  deleteDoc
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
        // Logic for tracking referral
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
      ...(referredByUid && { referredBy: referredByUid })
    };
    await setDoc(userRef, profile);
    return profile;
  }
  return snap.data() as UserProfile;
}

export async function getReferralCount(uid: string) {
  const q = query(collection(db, "referrals"), where("referrerUid", "==", uid));
  const snap = await getDocs(q);
  return snap.size;
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
}

export function generateHash(text: string, type: string) {
  const combined = `${type}:${text.trim().toLowerCase()}`;
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
    where("cachedHash", "==", hash)
  );
  const snap = await getDocs(q);
  if (!snap.empty) return snap.docs[0].data() as StudyDocument;
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

export async function getUserDocuments(uid: string, featureType?: string) {
  let q = query(collection(db, "documents"), where("uid", "==", uid), orderBy("createdAt", "desc"));
  if (featureType) {
    q = query(collection(db, "documents"), where("uid", "==", uid), where("featureType", "==", featureType), orderBy("createdAt", "desc"));
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as StudyDocument[];
}
