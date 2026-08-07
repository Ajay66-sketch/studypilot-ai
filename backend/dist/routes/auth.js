"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_js_1 = require("../controllers/auth.js");
const auth_js_2 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
router.post('/register', auth_js_1.registerController);
router.post('/login', auth_js_1.loginController);
router.post('/logout', auth_js_1.logoutController);
router.post('/refresh', auth_js_1.refreshController);
router.get('/me', auth_js_2.authenticate, auth_js_1.getMeController);
router.post('/onboarding', auth_js_2.authenticate, auth_js_1.updateOnboardingController);
exports.default = router;
//# sourceMappingURL=auth.js.map