import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './types/token-payload.type';
import { PrismaService } from '../prisma/prisma.service';
import { RefreshToken } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public generateRefreshToken(tokenPayload: TokenPayload): string {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN');

    return this.jwtService.sign(tokenPayload, {
      secret,
      expiresIn,
    });
  }

  public generateAccessToken(tokenPayload: TokenPayload): string {
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const expiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN');

    return this.jwtService.sign(tokenPayload, {
      secret,
      expiresIn,
    });
  }

  public async findByToken(token: string): Promise<RefreshToken> {
    try {
      return await this.prisma.refreshToken.findUnique({
        where: { token },
      });
    } catch (e) {
      throw new NotFoundException('RefreshToken не найден');
    }
  }

  public async deleteByToken(token: string): Promise<void> {
    try {
      await this.prisma.refreshToken.delete({
        where: { token },
      });
    } catch (e) {}
  }

  public async saveRefreshToken(
    userId: number,
    token: string,
  ): Promise<RefreshToken> {
    const refreshTokenFromDB = await this.prisma.refreshToken.findFirst({
      where: { userId },
    });

    if (refreshTokenFromDB) {
      return this.prisma.refreshToken.update({
        where: { id: refreshTokenFromDB.id },
        data: { token },
      });
    }

    return this.prisma.refreshToken.create({
      data: { userId, token },
    });
  }

  public async getRefreshTokenPayload(token: string): Promise<TokenPayload> {
    const payload = this.validateRefreshToken(token);
    const tokenFromDB = await this.prisma.refreshToken.findUnique({
      where: { token },
    });
    if (!(payload && tokenFromDB)) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    return payload;
  }

  private validateRefreshToken(token: string): TokenPayload {
    try {
      const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
      return this.jwtService.verify(token, {
        secret,
        ignoreExpiration: false,
      });
    } catch (e) {
      return null;
    }
  }
}
