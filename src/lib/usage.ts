import { getUsageApi } from "@/services/ai-service";

export async function checkUsageLimit(uid: string, plan: string): Promise<{ allowed: boolean; remaining: number }> {
  if (plan === "pro" || plan === "premium") return { allowed: true, remaining: Infinity };

  try {
    const data = await getUsageApi();
    return { allowed: data.remaining > 0, remaining: data.remaining };
  } catch {
    return { allowed: true, remaining: 5 };
  }
}

export async function incrementUsage(uid: string) {
  // Usage increment is handled automatically inside the backend AI controller
  return;
}