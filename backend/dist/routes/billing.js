"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const billing_js_1 = require("../controllers/billing.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
router.use(auth_js_1.authenticate);
router.post('/verify', billing_js_1.verifyBillingController);
exports.default = router;
//# sourceMappingURL=billing.js.map