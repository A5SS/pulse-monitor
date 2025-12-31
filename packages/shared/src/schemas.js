"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsRangeSchema = exports.updateServiceSchema = exports.createServiceSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    role: zod_1.z.enum(['ADMIN', 'MEMBER']).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.createServiceSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    baseUrl: zod_1.z.string().url(),
    healthPath: zod_1.z.string().default('/health'),
    method: zod_1.z.string().default('GET'),
    expectedStatus: zod_1.z.number().int().min(100).max(599).default(200),
    timeoutMs: zod_1.z.number().int().min(1000).max(60000).default(5000),
    intervalSec: zod_1.z.number().int().min(10).max(3600).default(60),
    enabled: zod_1.z.boolean().default(true),
});
exports.updateServiceSchema = exports.createServiceSchema.partial();
exports.metricsRangeSchema = zod_1.z.enum(['15m', '1h', '24h']).default('15m');
//# sourceMappingURL=schemas.js.map