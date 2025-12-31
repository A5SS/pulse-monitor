import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.alertEvent.findMany({
      where: {
        service: {
          createdBy: userId,
        },
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { triggeredAt: 'desc' },
      take: 50,
    });
  }
}

