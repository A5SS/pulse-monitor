import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@pulse-monitor.com' },
    update: {},
    create: {
      email: 'admin@pulse-monitor.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const service1 = await prisma.service.create({
    data: {
      name: 'Example API',
      baseUrl: 'https://httpbin.org',
      healthPath: '/status/200',
      method: 'GET',
      expectedStatus: 200,
      timeoutMs: 5000,
      intervalSec: 60,
      enabled: true,
      createdBy: admin.id,
    },
  });

  const service2 = await prisma.service.create({
    data: {
      name: 'JSONPlaceholder',
      baseUrl: 'https://jsonplaceholder.typicode.com',
      healthPath: '/posts/1',
      method: 'GET',
      expectedStatus: 200,
      timeoutMs: 5000,
      intervalSec: 60,
      enabled: true,
      createdBy: admin.id,
    },
  });

  await prisma.alertRule.create({
    data: {
      serviceId: service1.id,
      type: 'CONSECUTIVE_FAILS',
      threshold: 3,
      enabled: true,
    },
  });

  await prisma.alertRule.create({
    data: {
      serviceId: service2.id,
      type: 'CONSECUTIVE_FAILS',
      threshold: 3,
      enabled: true,
    },
  });

  console.log('Seed data created:', { admin: admin.email, services: [service1.name, service2.name] });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

