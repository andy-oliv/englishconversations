import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly jwtService: JwtService,
  ) {}

  async generateToken(payload: any): Promise<string> {
    try {
      return;
    } catch (error) {}
  }
}
