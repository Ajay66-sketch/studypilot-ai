"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocumentController = createDocumentController;
exports.getDocumentsController = getDocumentsController;
exports.getDocumentByIdController = getDocumentByIdController;
exports.updateDocumentController = updateDocumentController;
exports.deleteDocumentController = deleteDocumentController;
exports.findCachedDocumentController = findCachedDocumentController;
const prisma_js_1 = require("../lib/prisma.js");
const document_js_1 = require("../validators/document.js");
async function createDocumentController(req, res, next) {
    try {
        const userId = req.user.userId;
        const data = document_js_1.CreateDocumentSchema.parse(req.body);
        const serializedOutput = typeof data.outputText === 'string' ? data.outputText : JSON.stringify(data.outputText);
        const doc = await prisma_js_1.prisma.document.create({
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
    }
    catch (err) {
        next(err);
    }
}
async function getDocumentsController(req, res, next) {
    try {
        const userId = req.user.userId;
        const { featureType, search, favoritesOnly } = req.query;
        const whereClause = { userId };
        if (featureType && typeof featureType === 'string') {
            whereClause.featureType = featureType;
        }
        if (favoritesOnly === 'true') {
            whereClause.isFavorite = true;
        }
        if (search && typeof search === 'string') {
            whereClause.title = { contains: search };
        }
        const documents = await prisma_js_1.prisma.document.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });
        const parsedDocs = documents.map((d) => {
            let parsedOutput = d.outputText;
            try {
                if (typeof d.outputText === 'string' && (d.outputText.startsWith('{') || d.outputText.startsWith('['))) {
                    parsedOutput = JSON.parse(d.outputText);
                }
            }
            catch {
                // Keep raw output if parse fails
            }
            return { ...d, outputText: parsedOutput };
        });
        res.json({ documents: parsedDocs });
    }
    catch (err) {
        next(err);
    }
}
async function getDocumentByIdController(req, res, next) {
    try {
        const userId = req.user.userId;
        const id = req.params.id;
        const document = await prisma_js_1.prisma.document.findFirst({
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
        }
        catch { }
        res.json({ document: { ...document, outputText: parsedOutput } });
    }
    catch (err) {
        next(err);
    }
}
async function updateDocumentController(req, res, next) {
    try {
        const userId = req.user.userId;
        const id = req.params.id;
        const data = document_js_1.UpdateDocumentSchema.parse(req.body);
        const existing = await prisma_js_1.prisma.document.findFirst({ where: { id, userId } });
        if (!existing) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }
        const updated = await prisma_js_1.prisma.document.update({
            where: { id },
            data,
        });
        let parsedOutput = updated.outputText;
        try {
            if (typeof updated.outputText === 'string' && (updated.outputText.startsWith('{') || updated.outputText.startsWith('['))) {
                parsedOutput = JSON.parse(updated.outputText);
            }
        }
        catch { }
        res.json({ document: { ...updated, outputText: parsedOutput } });
    }
    catch (err) {
        next(err);
    }
}
async function deleteDocumentController(req, res, next) {
    try {
        const userId = req.user.userId;
        const id = req.params.id;
        const existing = await prisma_js_1.prisma.document.findFirst({ where: { id, userId } });
        if (!existing) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }
        await prisma_js_1.prisma.document.delete({ where: { id } });
        res.json({ message: 'Document deleted successfully' });
    }
    catch (err) {
        next(err);
    }
}
async function findCachedDocumentController(req, res, next) {
    try {
        const userId = req.user.userId;
        const { hash } = req.query;
        if (!hash || typeof hash !== 'string') {
            res.status(400).json({ error: 'Hash query parameter required' });
            return;
        }
        const document = await prisma_js_1.prisma.document.findFirst({
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
        }
        catch { }
        res.json({ document: { ...document, outputText: parsedOutput } });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=document.js.map