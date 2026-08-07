import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import {
  generateSummary,
  generateModelAnswer,
  generateImportantQuestions,
  generateRevisionSheet,
} from '../ai/gemini-service.js';
import {
  SummarizeSchema,
  ModelAnswerSchema,
  QuestionsSchema,
  RevisionSchema,
} from '../validators/ai.js';

async function checkAndIncrementUsage(userId: string, userPlan: string): Promise<void> {
  if (userPlan !== 'free') return; // Pro / Premium has unlimited usage

  const today = new Date().toISOString().split('T')[0];

  let usage = await prisma.usage.findUnique({ where: { userId } });

  if (!usage) {
    usage = await prisma.usage.create({
      data: { userId, requestsUsed: 0, lastResetDate: today },
    });
  }

  // Daily reset check
  if (usage.lastResetDate !== today) {
    usage = await prisma.usage.update({
      where: { userId },
      data: { requestsUsed: 0, lastResetDate: today },
    });
  }

  if (usage.requestsUsed >= 5) {
    const error: any = new Error('Daily usage limit of 5 generations reached. Upgrade to Pro for unlimited prep.');
    error.statusCode = 429;
    throw error;
  }

  await prisma.usage.update({
    where: { userId },
    data: { requestsUsed: { increment: 1 } },
  });
}

export async function summaryController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const userPlan = req.user!.plan;
    const data = SummarizeSchema.parse(req.body);

    await checkAndIncrementUsage(userId, userPlan);

    const result = await generateSummary(data.notes, data.subject, data.isExamBooster);
    res.json({ result });
  } catch (err) {
    next(err);
  }
}

export async function modelAnswerController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const userPlan = req.user!.plan;
    const data = ModelAnswerSchema.parse(req.body);

    await checkAndIncrementUsage(userId, userPlan);

    const result = await generateModelAnswer(data.questionOrTopic, data.subject, data.answerMode, data.isExamBooster);
    res.json({ result });
  } catch (err) {
    next(err);
  }
}

export async function questionsController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const userPlan = req.user!.plan;
    const data = QuestionsSchema.parse(req.body);

    await checkAndIncrementUsage(userId, userPlan);

    const result = await generateImportantQuestions(data.chapterNotes, data.subject, data.isExamBooster);
    res.json({ result });
  } catch (err) {
    next(err);
  }
}

export async function revisionController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const userPlan = req.user!.plan;
    const data = RevisionSchema.parse(req.body);

    await checkAndIncrementUsage(userId, userPlan);

    const result = await generateRevisionSheet(data.topic, data.subject, data.isExamBooster);
    res.json({ result });
  } catch (err) {
    next(err);
  }
}

export async function getUsageController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const userPlan = req.user!.plan;
    const today = new Date().toISOString().split('T')[0];

    let usage = await prisma.usage.findUnique({ where: { userId } });

    if (!usage || usage.lastResetDate !== today) {
      usage = { id: '', userId, requestsUsed: 0, lastResetDate: today, updatedAt: new Date() };
    }

    const remaining = userPlan === 'free' ? Math.max(0, 5 - usage.requestsUsed) : 999999;
    res.json({ used: usage.requestsUsed, remaining, limit: 5, plan: userPlan });
  } catch (err) {
    next(err);
  }
}
