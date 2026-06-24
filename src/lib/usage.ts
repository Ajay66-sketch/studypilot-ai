import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function checkUsageLimit(uid: string, plan: string): Promise<{ allowed: boolean; remaining: number }> {
  if (plan === "pro" || plan === "premium") return { allowed: true, remaining: Infinity };

  const usageRef = doc(db, "usage", uid);
  const usageSnap = await getDoc(usageRef);
  const today = new Date().toISOString().split("T")[0];

  if (!usageSnap.exists()) {
    await setDoc(usageRef, {
      uid,
      requestsUsed: 0,
      lastResetDate: today,
    });
    return { allowed: true, remaining: 5 };
  }

  const data = usageSnap.data();
  if (data.lastResetDate !== today) {
    await updateDoc(usageRef, {
      requestsUsed: 0,
      lastResetDate: today,
    });
    return { allowed: true, remaining: 5 };
  }

  const allowed = data.requestsUsed < 5;
  return { allowed, remaining: 5 - data.requestsUsed };
}

export async function incrementUsage(uid: string) {
  const usageRef = doc(db, "usage", uid);
  await updateDoc(usageRef, {
    requestsUsed: increment(1),
  });
}