import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.servicesService.findAll(user.sub);
  }

  @Post()
  create(@Body() body: any, @CurrentUser() user: any) {
    return this.servicesService.create(body, user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.servicesService.findOne(id, user.sub);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    return this.servicesService.update(id, body, user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.servicesService.remove(id, user.sub);
  }
}

