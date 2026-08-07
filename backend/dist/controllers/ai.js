"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summaryController = summaryController;
exports.modelAnswerController = modelAnswerController;
exports.questionsController = questionsController;
exports.revisionController = revisionController;
exports.getUsageController = getUsageController;
const prisma_js_1 = require("../lib/prisma.js");
const gemini_service_js_1 = require("../ai/gemini-service.js");
const ai_js_1 = require("../validators/ai.js");
async function checkAndIncrementUsage(userId, userPlan) {
    if (userPlan !== 'free')
        return; // Pro / Premium has unlimited usage
    const today = new Date().toISOString().split('T')[0];
    let usage = await prisma_js_1.prisma.usage.findUnique({ where: { userId } });
    if (!usage) {
        usage = await prisma_js_1.prisma.usage.create({
            data: { userId, requestsUsed: 0, lastResetDate: today },
        });
    }
    // Daily reset check
    if (usage.lastResetDate !== today) {
        usage = await prisma_js_1.prisma.usage.update({
            where: { userId },
            data: { requestsUsed: 0, lastResetDate: today },
        });
    }
    if (usage.requestsUsed >= 5) {
        const error = new Error('Daily usage limit of 5 generations reached. Upgrade to Pro for unlimited prep.');
        error.statusCode = 429;
        throw error;
    }
    await prisma_js_1.prisma.usage.update({
        where: { userId },
        data: { requestsUsed: { increment: 1 } },
    });
}
async function summaryController(req, res, next) {
    try {
        const userId = req.user.userId;
        const userPlan = req.user.plan;
        const data = ai_js_1.SummarizeSchema.parse(req.body);
        await checkAndIncrementUsage(userId, userPlan);
        const result = await (0, gemini_service_js_1.generateSummary)(data.notes, data.subject, data.isExamBooster);
        res.json({ result });
    }
    catch (err) {
        next(err);
    }
}
async function modelAnswerController(req, res, next) {
    try {
        const userId = req.user.userId;
        const userPlan = req.user.plan;
        const data = ai_js_1.ModelAnswerSchema.parse(req.body);
        await checkAndIncrementUsage(userId, userPlan);
        const result = await (0, gemini_service_js_1.generateModelAnswer)(data.questionOrTopic, data.subject, data.answerMode, data.isExamBooster);
        res.json({ result });
    }
    catch (err) {
        next(err);
    }
}
async function questionsController(req, res, next) {
    try {
        const userId = req.user.userId;
        const userPlan = req.user.plan;
        const data = ai_js_1.QuestionsSchema.parse(req.body);
        await checkAndIncrementUsage(userId, userPlan);
        const result = await (0, gemini_service_js_1.generateImportantQuestions)(data.chapterNotes, data.subject, data.isExamBooster);
        res.json({ result });
    }
    catch (err) {
        next(err);
    }
}
async function revisionController(req, res, next) {
    try {
        const userId = req.user.userId;
        const userPlan = req.user.plan;
        const data = ai_js_1.RevisionSchema.parse(req.body);
        await checkAndIncrementUsage(userId, userPlan);
        const result = await (0, gemini_service_js_1.generateRevisionSheet)(data.topic, data.subject, data.isExamBooster);
        res.json({ result });
    }
    catch (err) {
        next(err);
    }
}
async function getUsageController(req, res, next) {
    try {
        const userId = req.user.userId;
        const userPlan = req.user.plan;
        const today = new Date().toISOString().split('T')[0];
        let usage = await prisma_js_1.prisma.usage.findUnique({ where: { userId } });
        if (!usage || usage.lastResetDate !== today) {
            usage = { id: '', userId, requestsUsed: 0, lastResetDate: today, updatedAt: new Date() };
        }
        const remaining = userPlan === 'free' ? Math.max(0, 5 - usage.requestsUsed) : 999999;
        res.json({ used: usage.requestsUsed, remaining, limit: 5, plan: userPlan });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=ai.js.map