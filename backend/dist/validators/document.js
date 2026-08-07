"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDocumentSchema = exports.CreateDocumentSchema = void 0;
const zod_1 = require("zod");
exports.CreateDocumentSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    featureType: zod_1.z.enum(['summarize', 'answer', 'questions', 'revision']),
    subject: zod_1.z.string().optional(),
    answerMode: zod_1.z.string().optional(),
    isExamBooster: zod_1.z.boolean().default(false),
    isFavorite: zod_1.z.boolean().default(false),
    inputText: zod_1.z.string().min(1, 'Input text is required'),
    outputText: zod_1.z.any(),
    cachedHash: zod_1.z.string(),
    isPremiumOutput: zod_1.z.boolean().default(false),
});
exports.UpdateDocumentSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    isFavorite: zod_1.z.boolean().optional(),
    subject: zod_1.z.string().optional(),
});
//# sourceMappingURL=document.js.map