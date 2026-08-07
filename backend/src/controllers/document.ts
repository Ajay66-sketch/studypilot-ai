import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { CreateDocumentSchema, UpdateDocumentSchema } from '../validators/document.js';

export async function createDocumentController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const data = CreateDocumentSchema.parse(req.body);

    const serializedOutput = typeof data.outputText === 'string' ? data.outputText : JSON.stringify(data.outputText);

    const doc = await prisma.document.create({
      data: {
        userId,
        title: data.title,
        featureType: data.featureType,
        subject: data.subject,
        answerMode: data.answerMode,
        isExamBooster: data.isExamBooster,
        isFavorite: data.isFavorite,
        inputText: data.inputText,
        outputText: serializedOutput,
        cachedHash: data.cachedHash,
        isPremiumOutput: data.isPremiumOutput,
      },
    });

    res.status(201).json({
      document: {
        ...doc,
        outputText: data.outputText,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getDocumentsController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { featureType, search, favoritesOnly } = req.query;

    const whereClause: any = { userId };

    if (featureType && typeof featureType === 'string') {
      whereClause.featureType = featureType;
    }

    if (favoritesOnly === 'true') {
      whereClause.isFavorite = true;
    }

    if (search && typeof search === 'string') {
      whereClause.title = { contains: search };
    }

    const documents = await prisma.document.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    const parsedDocs = documents.map((d) => {
      let parsedOutput = d.outputText;
      try {
        if (typeof d.outputText === 'string' && (d.outputText.startsWith('{') || d.outputText.startsWith('['))) {
          parsedOutput = JSON.parse(d.outputText);
        }
      } catch {
        // Keep raw output if parse fails
      }
      return { ...d, outputText: parsedOutput };
    });

    res.json({ documents: parsedDocs });
  } catch (err) {
    next(err);
  }
}

export async function getDocumentByIdController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;

    const document = await prisma.document.findFirst({
      where: { id, userId },
    });

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    let parsedOutput = document.outputText;
    try {
      if (typeof document.outputText === 'string' && (document.outputText.startsWith('{') || document.outputText.startsWith('['))) {
        parsedOutput = JSON.parse(document.outputText);
      }
    } catch {}

    res.json({ document: { ...document, outputText: parsedOutput } });
  } catch (err) {
    next(err);
  }
}

export async function updateDocumentController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const data = UpdateDocumentSchema.parse(req.body);

    const existing = await prisma.document.findFirst({ where: { id, userId } });
    if (!existing) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    const updated = await prisma.document.update({
      where: { id },
      data,
    });

    let parsedOutput = updated.outputText;
    try {
      if (typeof updated.outputText === 'string' && (updated.outputText.startsWith('{') || updated.outputText.startsWith('['))) {
        parsedOutput = JSON.parse(updated.outputText);
      }
    } catch {}

    res.json({ document: { ...updated, outputText: parsedOutput } });
  } catch (err) {
    next(err);
  }
}

export async function deleteDocumentController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;

    const existing = await prisma.document.findFirst({ where: { id, userId } });
    if (!existing) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    await prisma.document.delete({ where: { id } });
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function findCachedDocumentController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { hash } = req.query;

    if (!hash || typeof hash !== 'string') {
      res.status(400).json({ error: 'Hash query parameter required' });
      return;
    }

    const document = await prisma.document.findFirst({
      where: { userId, cachedHash: hash },
    });

    if (!document) {
      res.json({ document: null });
      return;
    }

    let parsedOutput = document.outputText;
    try {
      if (typeof document.outputText === 'string' && (document.outputText.startsWith('{') || document.outputText.startsWith('['))) {
        parsedOutput = JSON.parse(document.outputText);
      }
    } catch {}

    res.json({ document: { ...document, outputText: parsedOutput } });
  } catch (err) {
    next(err);
  }
}
