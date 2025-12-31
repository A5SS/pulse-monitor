import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodOptional<z.ZodEnum<["ADMIN", "MEMBER"]>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    role?: "ADMIN" | "MEMBER" | undefined;
}, {
    email: string;
    password: string;
    role?: "ADMIN" | "MEMBER" | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const createServiceSchema: z.ZodObject<{
    name: z.ZodString;
    baseUrl: z.ZodString;
    healthPath: z.ZodDefault<z.ZodString>;
    method: z.ZodDefault<z.ZodString>;
    expectedStatus: z.ZodDefault<z.ZodNumber>;
    timeoutMs: z.ZodDefault<z.ZodNumber>;
    intervalSec: z.ZodDefault<z.ZodNumber>;
    enabled: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    baseUrl: string;
    healthPath: string;
    method: string;
    expectedStatus: number;
    timeoutMs: number;
    intervalSec: number;
    enabled: boolean;
}, {
    name: string;
    baseUrl: string;
    healthPath?: string | undefined;
    method?: string | undefined;
    expectedStatus?: number | undefined;
    timeoutMs?: number | undefined;
    intervalSec?: number | undefined;
    enabled?: boolean | undefined;
}>;
export declare const updateServiceSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    baseUrl: z.ZodOptional<z.ZodString>;
    healthPath: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    method: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    expectedStatus: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    timeoutMs: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    intervalSec: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    enabled: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    baseUrl?: string | undefined;
    healthPath?: string | undefined;
    method?: string | undefined;
    expectedStatus?: number | undefined;
    timeoutMs?: number | undefined;
    intervalSec?: number | undefined;
    enabled?: boolean | undefined;
}, {
    name?: string | undefined;
    baseUrl?: string | undefined;
    healthPath?: string | undefined;
    method?: string | undefined;
    expectedStatus?: number | undefined;
    timeoutMs?: number | undefined;
    intervalSec?: number | undefined;
    enabled?: boolean | undefined;
}>;
export declare const metricsRangeSchema: z.ZodDefault<z.ZodEnum<["15m", "1h", "24h"]>>;
