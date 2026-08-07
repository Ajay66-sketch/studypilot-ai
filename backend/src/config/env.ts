import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/studypilot?schema=public'),
  JWT_ACCESS_SECRET: z.string().default('studypilot_super_secret_jwt_access_key_2026'),
  JWT_REFRESH_SECRET: z.string().default('studypilot_super_secret_jwt_refresh_key_2026'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  CORS_ORIGIN: z.string().default('http://localhost:9002'),
});

export const env = envSchema.parse(process.env);
