import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'MEMBER']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createServiceSchema = z.object({
  name: z.string().min(1),
  baseUrl: z.string().url(),
  healthPath: z.string().default('/health'),
  method: z.string().default('GET'),
  expectedStatus: z.number().int().min(100).max(599).default(200),
  timeoutMs: z.number().int().min(1000).max(60000).default(5000),
  intervalSec: z.number().int().min(10).max(3600).default(60),
  enabled: z.boolean().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();

export const metricsRangeSchema = z.enum(['15m', '1h', '24h']).default('15m');

