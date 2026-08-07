"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const document_js_1 = require("../controllers/document.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
router.use(auth_js_1.authenticate);
router.post('/', document_js_1.createDocumentController);
router.get('/', document_js_1.getDocumentsController);
router.get('/cache', document_js_1.findCachedDocumentController);
router.get('/:id', document_js_1.getDocumentByIdController);
router.put('/:id', document_js_1.updateDocumentController);
router.delete('/:id', document_js_1.deleteDocumentController);
exports.default = router;
//# sourceMappingURL=document.js.map