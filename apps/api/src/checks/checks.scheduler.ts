import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { ChecksService } from './checks.service';

@Injectable()
export class ChecksScheduler implements OnModuleInit {
  private readonly logger = new Logger(ChecksScheduler.name);
  private checkIntervals = new Map<string, NodeJS.Timeout>();

  constructor(
    private prisma: PrismaService,
    private checksService: ChecksService,
  ) {}

  onModuleInit() {
    this.scheduleAllServices();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async scheduleAllServices() {
    const services = await this.prisma.service.findMany({
      where: { enabled: true },
    });

    for (const service of services) {
      const key = service.id;
      const lastCheck = service.lastCheckedAt?.getTime() || 0;
      const now = Date.now();
      const intervalMs = service.intervalSec * 1000;

      if (now - lastCheck >= intervalMs) {
        this.logger.debug(`Running check for service ${service.name}`);
        this.checksService.performCheck(service.id).catch((err) => {
          this.logger.error(`Check failed for service ${service.id}: ${err.message}`);
        });
      }
    }
  }
}

