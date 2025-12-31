import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createServiceSchema, updateServiceSchema } from '@pulse-monitor/shared';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.service.findMany({
      where: {
        createdBy: userId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        checkRuns: {
          take: 10,
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (service.createdBy !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return service;
  }

  async create(data: any, userId: string) {
    const validated = createServiceSchema.parse(data);
    return this.prisma.service.create({
      data: {
        ...validated,
        createdBy: userId,
      },
    });
  }

  async update(id: string, data: any, userId: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    if (service.createdBy !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const validated = updateServiceSchema.parse(data);
    return this.prisma.service.update({
      where: { id },
      data: validated,
    });
  }

  async remove(id: string, userId: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    if (service.createdBy !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.service.delete({ where: { id } });
    return { message: 'Service deleted' };
  }
}

