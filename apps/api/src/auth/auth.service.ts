import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { AuthUser } from './types/auth-user.type';
import { JwtService } from '@nestjs/jwt';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ user: AuthUser; accessToken: string }> {
    const email = dto.email.toLowerCase();

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email,
        name: dto.name?.trim() || null,
        passwordHash,
      },
    });
    const authUser = this.toAuthUser(user);
    const accessToken = await this.signToken(authUser);
    return { user: authUser, accessToken }; 
   }

   async login(dto: LoginDto): Promise<{ user: AuthUser; accessToken: string }> {
    const email = dto.email.toLowerCase();

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const authUser = this.toAuthUser(user);
  const accessToken = await this.signToken(authUser);
  return { user: authUser, accessToken };
  }
  async findUserById(id: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toAuthUser(user) : null;
  }
  
  private async signToken(user: AuthUser): Promise<string> {
    return this.jwtService.signAsync({ sub: user.id, email: user.email });
  }
  private toAuthUser(user: {
    id: string;
    email: string;
    name: string | null;
  }): AuthUser {
    return { id: user.id, email: user.email, name: user.name };
  }
}