import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { metricsRangeSchema } from '@pulse-monitor/shared';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('summary')
  getSummary(@CurrentUser() user: any) {
    return this.dashboardService.getSummary(user.sub);
  }

  @Get('services/:id/metrics')
  getServiceMetrics(
    @Param('id') id: string,
    @Query('range') range: string,
    @CurrentUser() user: any,
  ) {
    const validated = metricsRangeSchema.parse(range || '15m');
    return this.dashboardService.getServiceMetrics(id, validated, user.sub);
  }
}

