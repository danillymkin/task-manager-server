import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';

const mockTask: Task = {
  id: 1,
  name: 'New task',
  description: 'New task',
  priority: 3,
  deadline: new Date(),
  completedAt: new Date(),
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCreateTaskInput: CreateTaskInput = {
  name: mockTask.name,
  deadline: mockTask.deadline.toISOString(),
  description: mockTask.description,
  priority: mockTask.priority,
};

const prisma = {
  task: {
    findMany: jest.fn().mockResolvedValue([mockTask]),
    findUniqueOrThrow: jest.fn(),
    create: jest.fn(),
  },
};

describe('TaskService', () => {
  let taskService: TaskService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of tasks', async () => {
      const tasks = await taskService.findAll();

      expect(tasks).toContain(mockTask);
    });
  });

  describe('findOneById', () => {
    it('should return the task', async () => {
      jest
        .spyOn(prismaService.task, 'findUniqueOrThrow')
        .mockResolvedValueOnce(mockTask);

      const task = await taskService.findOneById(mockTask.id);

      expect(task).toEqual(mockTask);
    });

    it('should throw NotFoundException', async () => {
      jest
        .spyOn(prismaService.task, 'findUniqueOrThrow')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(taskService.findOneById(mockTask.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create new task', async () => {
      jest.spyOn(prismaService.task, 'create').mockResolvedValueOnce(mockTask);

      const task = await taskService.create(mockCreateTaskInput);

      expect(task).toEqual(mockTask);
    });
  });
});
