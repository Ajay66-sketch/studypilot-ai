"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_js_1 = require("./config/env.js");
const logger_js_1 = require("./utils/logger.js");
const error_handler_js_1 = require("./middleware/error-handler.js");
const auth_js_1 = __importDefault(require("./routes/auth.js"));
const document_js_1 = __importDefault(require("./routes/document.js"));
const ai_js_1 = __importDefault(require("./routes/ai.js"));
const billing_js_1 = __importDefault(require("./routes/billing.js"));
const app = (0, express_1.default)();
// Security & Middleware
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: env_js_1.env.CORS_ORIGIN,
    credentials: true,
}));
// Rate Limiting
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20, // 20 login/register attempts per 15 min
    message: { error: 'Too many authentication attempts, please try again later.' },
});
app.use('/api/auth', authLimiter, auth_js_1.default);
app.use('/api/documents', apiLimiter, document_js_1.default);
app.use('/api/ai', apiLimiter, ai_js_1.default);
app.use('/api/billing', apiLimiter, billing_js_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', environment: env_js_1.env.NODE_ENV, timestamp: new Date().toISOString() });
});
// Central Error Handler
app.use(error_handler_js_1.errorHandler);
const PORT = parseInt(env_js_1.env.PORT, 10);
app.listen(PORT, () => {
    logger_js_1.logger.info(`🚀 StudyPilot Backend Server listening on port ${PORT} in ${env_js_1.env.NODE_ENV} mode`);
});
//# sourceMappingURL=index.js.map