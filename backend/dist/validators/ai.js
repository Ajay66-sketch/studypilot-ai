"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevisionSchema = exports.QuestionsSchema = exports.ModelAnswerSchema = exports.SummarizeSchema = void 0;
const zod_1 = require("zod");
exports.SummarizeSchema = zod_1.z.object({
    notes: zod_1.z.string().min(1, 'Notes text is required'),
    subject: zod_1.z.string().optional(),
    isExamBooster: zod_1.z.boolean().optional(),
});
exports.ModelAnswerSchema = zod_1.z.object({
    questionOrTopic: zod_1.z.string().min(1, 'Question or topic is required'),
    subject: zod_1.z.string().optional(),
    answerMode: zod_1.z.enum(['short', 'medium', 'long', 'bullet']).default('medium'),
    isExamBooster: zod_1.z.boolean().optional(),
});
exports.QuestionsSchema = zod_1.z.object({
    chapterNotes: zod_1.z.string().min(1, 'Chapter notes are required'),
    subject: zod_1.z.string().optional(),
    isExamBooster: zod_1.z.boolean().optional(),
});
exports.RevisionSchema = zod_1.z.object({
    topic: zod_1.z.string().min(1, 'Topic text is required'),
    subject: zod_1.z.string().optional(),
    isExamBooster: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=ai.js.map