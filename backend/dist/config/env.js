"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('5000'),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: zod_1.z.string().default('postgresql://postgres:postgres@localhost:5432/studypilot?schema=public'),
    JWT_ACCESS_SECRET: zod_1.z.string().default('studypilot_super_secret_jwt_access_key_2026'),
    JWT_REFRESH_SECRET: zod_1.z.string().default('studypilot_super_secret_jwt_refresh_key_2026'),
    GEMINI_API_KEY: zod_1.z.string().min(1, 'GEMINI_API_KEY is required'),
    RAZORPAY_KEY_ID: zod_1.z.string().optional(),
    RAZORPAY_KEY_SECRET: zod_1.z.string().optional(),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:9002'),
});
exports.env = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map