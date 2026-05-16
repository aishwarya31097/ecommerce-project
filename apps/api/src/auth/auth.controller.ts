import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AUTH_COOKIE_NAME } from './auth.constants';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import type { AuthUser } from './types/auth-user.type';

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('status')
  status() {
    return { module: 'auth', ready: true };
  }

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken } = await this.authService.register(dto);
    this.setAuthCookie(res, accessToken);
    return { user };
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken } = await this.authService.login(dto);
    this.setAuthCookie(res, accessToken);
    return { user };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    this.clearAuthCookie(res);
    return { ok: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthUser) {
    return { user };
  }

  private setAuthCookie(res: Response, token: string) {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: COOKIE_MAX_AGE_MS,
      path: '/',
    });
  }

  private clearAuthCookie(res: Response) {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
    });
  }
}