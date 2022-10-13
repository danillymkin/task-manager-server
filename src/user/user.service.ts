import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterInput } from '../auth/dto/register.input';
import { LoginInput } from '../auth/dto/login.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  public async findOneById(id: number): Promise<User> {
    try {
      return this.prisma.user.findUniqueOrThrow({
        where: { id },
      });
    } catch (e) {
      throw new NotFoundException(`Пользователь с id: ${id} не найден`);
    }
  }

  public async findOneByEmail(email: string): Promise<User> {
    try {
      return this.prisma.user.findUniqueOrThrow({
        where: { email },
      });
    } catch (e) {
      throw new NotFoundException(`Пользователь с E-Mail: ${email} не найден`);
    }
  }

  public async findOneByNickName(nickName: string): Promise<User> {
    try {
      return this.prisma.user.findUniqueOrThrow({
        where: { nickName },
      });
    } catch (e) {
      throw new NotFoundException(
        `Пользователь с никнеймом: ${nickName} не найден`,
      );
    }
  }

  public async create(registerInput: RegisterInput): Promise<User> {
    const hashedPassword = await this.hashPassword(registerInput.password);

    return this.prisma.user.create({
      data: {
        email: registerInput.email,
        nickName: registerInput.nickName,
        password: hashedPassword,
      },
    });
  }

  public async validate({ email, password }: LoginInput): Promise<User> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { email },
      });

      const passwordsEquals = await bcrypt.compare(password, user.password);
      if (passwordsEquals) {
        return user;
      }
    } catch (e) {
      throw new BadRequestException('Неверный E-Mail или пароль');
    }
  }

  public async existByEmail(email: string): Promise<boolean> {
    const candidate = await this.prisma.user.findUnique({
      where: { email },
    });
    return !!candidate;
  }

  public async existByNickName(nickName: string): Promise<boolean> {
    const candidate = await this.prisma.user.findUnique({
      where: { nickName },
    });
    return !!candidate;
  }

  private async hashPassword(password: string): Promise<string> {
    const hashSalt = await bcrypt.genSalt();
    return await bcrypt.hash(password, hashSalt);
  }
}
