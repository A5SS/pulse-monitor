import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceStatus } from '@pulse-monitor/shared';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary(userId: string) {
    const services = await this.prisma.service.findMany({
      where: { createdBy: userId },
    });

    const upCount = services.filter((s) => s.lastStatus === ServiceStatus.UP).length;
    const downCount = services.filter((s) => s.lastStatus === ServiceStatus.DOWN).length;

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const recentChecks = await this.prisma.checkRun.findMany({
      where: {
        service: {
          createdBy: userId,
        },
        timestamp: {
          gte: fifteenMinutesAgo,
        },
        latencyMs: {
          not: null,
        },
      },
      select: {
        latencyMs: true,
      },
    });

    const avgLatency =
      recentChecks.length > 0
        ? recentChecks.reduce((sum, c) => sum + (c.latencyMs || 0), 0) / recentChecks.length
        : 0;

    return {
      totalServices: services.length,
      upCount,
      downCount,
      avgLatencyMs: Math.round(avgLatency),
    };
  }

  async getServiceMetrics(serviceId: string, range: string, userId: string) {
    const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
    if (!service || service.createdBy !== userId) {
      throw new Error('Service not found');
    }

    let minutes = 15;
    if (range === '1h') minutes = 60;
    if (range === '24h') minutes = 24 * 60;

    const startTime = new Date(Date.now() - minutes * 60 * 1000);

    const checkRuns = await this.prisma.checkRun.findMany({
      where: {
        serviceId,
        timestamp: {
          gte: startTime,
        },
      },
      orderBy: { timestamp: 'asc' },
      select: {
        timestamp: true,
        status: true,
        latencyMs: true,
      },
    });

    return checkRuns.map((run) => ({
      timestamp: run.timestamp.toISOString(),
      status: run.status,
      latencyMs: run.latencyMs || 0,
    }));
  }
}

