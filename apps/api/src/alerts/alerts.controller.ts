import { Controller, Get, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('alerts')
@UseGuards(JwtAuthGuard)
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.alertsService.findAll(user.sub);
  }
}

