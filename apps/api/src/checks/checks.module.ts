import { Module } from '@nestjs/common';
import { ChecksService } from './checks.service';
import { ChecksScheduler } from './checks.scheduler';
import { EventsGateway } from '../events/events.gateway';

@Module({
  providers: [ChecksService, ChecksScheduler, EventsGateway],
  exports: [ChecksService],
})
export class ChecksModule {}

