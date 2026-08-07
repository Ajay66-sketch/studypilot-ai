"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_js_1 = require("../utils/logger.js");
const zod_1 = require("zod");
function errorHandler(err, req, res, next) {
    logger_js_1.logger.error(err);
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            error: 'Validation failed',
            details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
        });
        return;
    }
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
}
//# sourceMappingURL=error-handler.js.map