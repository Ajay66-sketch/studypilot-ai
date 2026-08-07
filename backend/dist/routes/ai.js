"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_js_1 = require("../controllers/ai.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
router.use(auth_js_1.authenticate);
router.post('/summary', ai_js_1.summaryController);
router.post('/model-answer', ai_js_1.modelAnswerController);
router.post('/questions', ai_js_1.questionsController);
router.post('/revision', ai_js_1.revisionController);
router.get('/usage', ai_js_1.getUsageController);
exports.default = router;
//# sourceMappingURL=ai.js.map