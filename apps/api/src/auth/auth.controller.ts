import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { registerSchema, loginSchema } from '@pulse-monitor/shared';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  async register(@Body() body: { email: string; password: string; role?: string }) {
    const data = registerSchema.parse(body);
    return this.authService.register(data.email, data.password, data.role as any);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    const data = loginSchema.parse(body);
    const user = await this.authService.validateUser(data.email, data.password);
    return this.authService.login(user);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async refresh(@CurrentUser() user: any) {
    return this.authService.refresh(user.sub);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout() {
    return { message: 'Logged out successfully' };
  }
}

