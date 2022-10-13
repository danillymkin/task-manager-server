import { TokenService } from '../token.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RefreshToken } from '@prisma/client';
import { TokenPayload } from '../types/token-payload.type';
import { UnauthorizedException } from '@nestjs/common';

const prisma = {
  refreshToken: {
    findUnique: jest.fn(),
    delete: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
};

const mockTokenPayload: TokenPayload = {
  id: 1,
  email: 'test@mail.ru',
};
const mockRefreshToken: RefreshToken = {
  id: 1,
  token: 'token',
  userId: 1,
};

describe('TokenService', () => {
  let tokenService: TokenService;
  let configService: ConfigService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, JwtModule],
      providers: [
        TokenService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
    configService = module.get<ConfigService>(ConfigService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });

  describe('generateRefreshToken', () => {
    it('should generate a correct refresh token', () => {
      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce('secret')
        .mockReturnValueOnce('14d');

      const refreshToken = tokenService.generateRefreshToken({
        id: mockTokenPayload.id,
        email: mockTokenPayload.email,
      });

      expect(refreshToken.split('.').length).toBe(3);
    });
  });

  describe('generateAccessToken', () => {
    it('should generate a correct access token', () => {
      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce('secret')
        .mockReturnValueOnce('10m');

      const refreshToken = tokenService.generateAccessToken({
        id: mockTokenPayload.id,
        email: mockTokenPayload.email,
      });

      expect(refreshToken.split('.').length).toEqual(3);
    });
  });

  describe('saveRefreshToken', () => {
    it('should create a new refresh token', async () => {
      jest
        .spyOn(prismaService.refreshToken, 'findFirst')
        .mockResolvedValueOnce(null);

      await tokenService.saveRefreshToken(1, mockRefreshToken.token);

      expect(prismaService.refreshToken.create).toHaveBeenCalledWith({
        data: { userId: 1, token: mockRefreshToken.token },
      });
    });

    it('should update the refresh token', async () => {
      jest
        .spyOn(prismaService.refreshToken, 'findFirst')
        .mockResolvedValueOnce(mockRefreshToken);

      await tokenService.saveRefreshToken(
        mockRefreshToken.userId,
        mockRefreshToken.token,
      );

      expect(prismaService.refreshToken.update).toHaveBeenCalledWith({
        where: { id: mockRefreshToken.id },
        data: { token: mockRefreshToken.token },
      });
    });
  });

  describe('deleteByToken', () => {
    it('should call prisma delete with correct params', async () => {
      await tokenService.deleteByToken(mockRefreshToken.token);

      expect(prismaService.refreshToken.delete).toHaveBeenCalledWith({
        where: { token: mockRefreshToken.token },
      });
    });
  });

  describe('getRefreshTokenPayload', () => {
    it('should return refresh token payload', async () => {
      jest.spyOn(configService, 'get').mockReturnValueOnce('secret');
      jest.spyOn(jwtService, 'verify').mockReturnValueOnce(mockTokenPayload);
      jest
        .spyOn(prismaService.refreshToken, 'findUnique')
        .mockResolvedValueOnce(mockRefreshToken);

      const payload = await tokenService.getRefreshTokenPayload(
        mockRefreshToken.token,
      );

      expect(payload).toEqual(mockTokenPayload);
    });

    it('should throw UnauthorizedException because token is invalid', async () => {
      jest.spyOn(configService, 'get').mockReturnValueOnce('secret');
      jest.spyOn(jwtService, 'verify').mockReturnValueOnce(null);
      jest
        .spyOn(prismaService.refreshToken, 'findUnique')
        .mockResolvedValueOnce(mockRefreshToken);

      await expect(
        tokenService.getRefreshTokenPayload(mockRefreshToken.token),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException because token is not found in database', async () => {
      jest.spyOn(configService, 'get').mockReturnValueOnce('secret');
      jest.spyOn(jwtService, 'verify').mockReturnValueOnce(mockTokenPayload);
      jest
        .spyOn(prismaService.refreshToken, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(
        tokenService.getRefreshTokenPayload(mockRefreshToken.token),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException because token not found in database and invalid', async () => {
      jest.spyOn(configService, 'get').mockReturnValueOnce('secret');
      jest.spyOn(jwtService, 'verify').mockReturnValueOnce(null);
      jest
        .spyOn(prismaService.refreshToken, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(
        tokenService.getRefreshTokenPayload(mockRefreshToken.token),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
