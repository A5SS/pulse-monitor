export declare enum UserRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER"
}
export declare enum ServiceStatus {
    UP = "UP",
    DOWN = "DOWN"
}
export declare enum AlertRuleType {
    CONSECUTIVE_FAILS = "CONSECUTIVE_FAILS"
}
export interface User {
    id: string;
    email: string;
    role: UserRole;
    createdAt: Date;
}
export interface Service {
    id: string;
    name: string;
    baseUrl: string;
    healthPath: string;
    method: string;
    expectedStatus: number;
    timeoutMs: number;
    intervalSec: number;
    enabled: boolean;
    createdBy: string;
    createdAt: Date;
    lastStatus?: ServiceStatus;
    lastLatencyMs?: number;
    lastCheckedAt?: Date;
}
export interface CheckRun {
    id: string;
    serviceId: string;
    timestamp: Date;
    status: ServiceStatus;
    statusCode?: number;
    latencyMs?: number;
    errorMessage?: string;
}
export interface AlertRule {
    id: string;
    serviceId: string;
    type: AlertRuleType;
    threshold: number;
    enabled: boolean;
}
export interface AlertEvent {
    id: string;
    serviceId: string;
    ruleId: string;
    triggeredAt: Date;
    message: string;
}
