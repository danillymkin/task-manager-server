import { UserService } from '../user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterInput } from '../../auth/dto/register.input';

const mockUser: User = {
  id: 1,
  firstName: 'test',
  lastName: 'test',
  email: 'test@mail.ru',
  nickName: 'test123',
  password: 'password',
  bio: 'bio',
  createdAt: new Date(),
};

const mockRegisterInput: RegisterInput = {
  email: mockUser.email,
  nickName: mockUser.nickName,
  password: mockUser.password,
};

const prisma = {
  user: {
    findMany: jest.fn().mockResolvedValue([mockUser]),
    findUniqueOrThrow: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return list of users', async () => {
      const users = await userService.findAll();

      expect(users).toContain(mockUser);
    });
  });

  describe('findOneById', () => {
    it('should return the user', async () => {
      jest
        .spyOn(prismaService.user, 'findUniqueOrThrow')
        .mockResolvedValueOnce(mockUser);

      const user = await userService.findOneById(mockUser.id);

      expect(user).toEqual(mockUser);
    });

    it('should throw NotFoundException', async () => {
      jest
        .spyOn(prismaService.user, 'findUniqueOrThrow')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(userService.findOneById(mockUser.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should return the user', async () => {
      jest
        .spyOn(prismaService.user, 'findUniqueOrThrow')
        .mockResolvedValueOnce(mockUser);

      const user = await userService.findOneByEmail(mockUser.email);

      expect(user).toEqual(mockUser);
    });

    it('should throw NotFoundException', async () => {
      jest
        .spyOn(prismaService.user, 'findUniqueOrThrow')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(userService.findOneByEmail(mockUser.email)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneByNickName', () => {
    it('should return the user', async () => {
      jest
        .spyOn(prismaService.user, 'findUniqueOrThrow')
        .mockResolvedValueOnce(mockUser);

      const user = await userService.findOneByNickName(mockUser.nickName);

      expect(user).toEqual(mockUser);
    });

    it('should throw NotFoundException', async () => {
      jest
        .spyOn(prismaService.user, 'findUniqueOrThrow')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(
        userService.findOneByNickName(mockUser.nickName),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create new user', async () => {
      jest.spyOn(prismaService.user, 'create').mockResolvedValueOnce(mockUser);

      const user = await userService.create(mockRegisterInput);

      expect(user).toEqual(mockUser);
    });

    it('should hash password', async () => {
      jest.spyOn(prismaService.user, 'create').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => 'hash');

      await userService.create(mockRegisterInput);

      await expect(bcrypt.hash).toReturnWith('hash');
    });
  });

  describe('validate', () => {
    it('should return the user', async () => {
      jest
        .spyOn(prismaService.user, 'findUniqueOrThrow')
        .mockResolvedValueOnce(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => Promise.resolve(true));

      const user = await userService.validate({
        email: mockUser.email,
        password: mockUser.password,
      });

      expect(user).toEqual(mockUser);
    });

    it('should throw BadRequestException because user is not found in database', async () => {
      jest
        .spyOn(prismaService.user, 'findUniqueOrThrow')
        .mockRejectedValueOnce(null);

      await expect(
        userService.validate({
          email: mockUser.email,
          password: mockUser.password,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException because password is incorrect', async () => {
      jest
        .spyOn(prismaService.user, 'findUniqueOrThrow')
        .mockRejectedValueOnce(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => Promise.resolve(false));

      await expect(
        userService.validate({
          email: mockUser.email,
          password: mockUser.password,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('existByEmail', () => {
    it('should return true', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(mockUser);

      const isExist = await userService.existByEmail(mockUser.email);

      expect(isExist).toBe(true);
    });

    it('should return false', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);

      const isExist = await userService.existByEmail(mockUser.email);

      expect(isExist).toBe(false);
    });
  });

  describe('existByNickName', () => {
    it('should return true', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(mockUser);

      const isExist = await userService.existByNickName(mockUser.nickName);

      expect(isExist).toBe(true);
    });

    it('should return false', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);

      const isExist = await userService.existByNickName(mockUser.nickName);

      expect(isExist).toBe(false);
    });
  });
});
