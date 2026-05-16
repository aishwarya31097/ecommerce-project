import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_COOKIE_NAME } from '../auth.constants';
import { AuthService } from '../auth.service';
import type { AuthUser } from '../types/auth-user.type';

type JwtPayload = { sub: string; email: string };

function tokenFromCookie(req: Request): string | null {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  return typeof token === 'string' && token.length > 0 ? token : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is required in apps/api/.env');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        tokenFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.authService.findUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}