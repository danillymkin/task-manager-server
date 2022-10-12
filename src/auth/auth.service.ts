import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginResponse } from './dto/login.response';
import { RegisterInput } from './dto/register.input';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { User } from '../user/entities/user.entity';
import {
  REFRESH_TOKEN_COOKIE_MAX_AGE,
  REFRESH_TOKEN_COOKIE_NAME,
} from './utils/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  public async login(user: User, response: Response): Promise<LoginResponse> {
    const accessToken = this.tokenService.generateAccessToken({
      id: user.id,
      email: user.email,
    });
    await this.setRefreshToken(user, response);

    return {
      accessToken,
      user,
    };
  }

  public async register(registerInput: RegisterInput, response: Response) {
    await this.checkIsUserExist(registerInput);
    const user = await this.userService.create(registerInput);

    return this.login(user, response);
  }

  public async refresh(
    refreshToken: string,
    response: Response,
  ): Promise<LoginResponse> {
    try {
      const tokenPayload = await this.tokenService.getRefreshTokenPayload(
        refreshToken,
      );
      const user = await this.userService.findOneById(tokenPayload.id);

      return await this.login(user, response);
    } catch (e) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
  }

  public async logout(refreshToken: string, response: Response): Promise<void> {
    response.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    await this.tokenService.deleteByToken(refreshToken);
  }

  private async setRefreshToken(user: User, response: Response): Promise<void> {
    const refreshToken = this.tokenService.generateRefreshToken(user);
    await this.tokenService.saveRefreshToken(user.id, refreshToken);
    this.setRefreshTokenInCookie(refreshToken, response);
  }

  private setRefreshTokenInCookie(token: string, response: Response): void {
    response.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
      httpOnly: true,
    });
  }

  private async checkIsUserExist(registerInput: RegisterInput) {
    const isUserExistByEmail = await this.userService.existByEmail(
      registerInput.email,
    );
    if (isUserExistByEmail) {
      throw new BadRequestException(
        'Пользователь с таким E-Mail уже существует',
      );
    }

    const isUserExistByNickName = await this.userService.existByNickName(
      registerInput.nickName,
    );
    if (isUserExistByNickName) {
      throw new BadRequestException(
        'Пользователь с таким никнеймом уже существует',
      );
    }
  }
}
