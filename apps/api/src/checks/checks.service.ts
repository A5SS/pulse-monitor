import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceStatus } from '@pulse-monitor/shared';
import axios from 'axios';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class ChecksService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) { }

  async performCheck(serviceId: string) {
    const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
    if (!service || !service.enabled) {
      return;
    }

    const startTime = Date.now();
    let status: ServiceStatus = ServiceStatus.DOWN;
    let statusCode: number | undefined;
    let errorMessage: string | undefined;
    let latencyMs: number | undefined;

    try {
      const url = `${service.baseUrl}${service.healthPath}`;
      const response = await axios({
        method: service.method as any,
        url,
        timeout: service.timeoutMs,
        validateStatus: () => true,
      });

      statusCode = response.status;
      latencyMs = Date.now() - startTime;

      if (statusCode >= service.expectedStatus && statusCode < service.expectedStatus + 100) {
        status = ServiceStatus.UP;
      } else {
        errorMessage = `Expected status ${service.expectedStatus}, got ${statusCode}`;
      }
    } catch (error: any) {
      latencyMs = Date.now() - startTime;
      errorMessage = error.message || 'Request failed';
    }

    const checkRun = await this.prisma.checkRun.create({
      data: {
        serviceId,
        status,
        statusCode,
        latencyMs,
        errorMessage,
      },
    });

    await this.prisma.service.update({
      where: { id: serviceId },
      data: {
        lastStatus: status,
        lastLatencyMs: latencyMs,
        lastCheckedAt: new Date(),
      },
    });

    this.eventsGateway.emitCheckUpdate(serviceId, checkRun);

    await this.checkAlerts(serviceId, status);

    return checkRun;
  }

  private async checkAlerts(serviceId: string, status: ServiceStatus) {
    if (status === ServiceStatus.UP) {
      return;
    }

    const rules = await this.prisma.alertRule.findMany({
      where: {
        serviceId,
        enabled: true,
        type: 'CONSECUTIVE_FAILS',
      },
    });

    for (const rule of rules) {
      const lastRuns = await this.prisma.checkRun.findMany({
        where: { serviceId },
        orderBy: { timestamp: 'desc' },
        take: rule.threshold,
      });

      if (lastRuns.length === rule.threshold && lastRuns.every((r) => r.status === ServiceStatus.DOWN)) {
        const existing = await this.prisma.alertEvent.findFirst({
          where: {
            serviceId,
            ruleId: rule.id,
            triggeredAt: {
              gte: new Date(Date.now() - 60000),
            },
          },
        });

        if (!existing) {
          const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
          await this.prisma.alertEvent.create({
            data: {
              serviceId,
              ruleId: rule.id,
              message: `Service ${service?.name} has failed ${rule.threshold} consecutive checks`,
            },
          });

          this.eventsGateway.emitAlert(serviceId, {
            message: `Service ${service?.name} has failed ${rule.threshold} consecutive checks`,
          });
        }
      }
    }
  }
}

