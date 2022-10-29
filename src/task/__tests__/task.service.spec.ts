import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Task } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateTaskInput } from '../dto/update-task.input';
import { TaskService } from '../task.service';

const mockTask: Task = {
  id: 1,
  name: 'task name',
  description: 'description',
  priority: 2,
  deadline: new Date('2022-10-28T15:55:00Z'),
  isCompleted: false,
  completedAt: null,
  isDeleted: false,
  createdAt: new Date('2022-10-28T15:55:00Z'),
  updatedAt: new Date('2022-10-28T15:55:00Z'),
  deletedAt: null,
};

const mockUpdateInputTask: UpdateTaskInput = {
  id: mockTask.id,
  name: 'task',
  description: 'task',
  deadline: '2022-10-28T15:55:00Z',
  priority: 1,
};

const prisma = {
  task: {
    findMany: jest.fn().mockReturnValue([mockTask]),
    create: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest
      .fn()
      .mockResolvedValue({ ...mockTask, ...mockUpdateInputTask }),
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
    expect(prismaService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return list of tasks', async () => {
      const tasks = await taskService.findAll();

      expect(tasks).toEqual([mockTask]);
    });
  });

  describe('findOneById', () => {
    it('should return a task', async () => {
      jest
        .spyOn(prismaService.task, 'findUniqueOrThrow')
        .mockResolvedValue(mockTask);

      const task = await taskService.findOneById(mockTask.id);

      expect(task).toBe(mockTask);
    });

    it('should throw NotFoundException', async () => {
      jest
        .spyOn(prismaService.task, 'findUniqueOrThrow')
        .mockRejectedValue(null);

      await expect(taskService.findOneById(mockTask.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const task = await taskService.update(mockUpdateInputTask);

      expect(task).toEqual({ ...mockTask, ...mockUpdateInputTask });
    });

    it('should throw NotFoundException', async () => {
      jest.spyOn(prismaService.task, 'update').mockRejectedValue(null);

      await expect(taskService.update(mockUpdateInputTask)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should set deleted flag', async () => {
      jest.spyOn(prismaService.task, 'update').mockResolvedValue({
        ...mockTask,
        isDeleted: true,
        deletedAt: new Date('2022-10-28T15:55:00Z'),
      });

      const task = await taskService.remove(mockTask.id);

      expect(task).toEqual({
        ...mockTask,
        isDeleted: true,
        deletedAt: new Date('2022-10-28T15:55:00Z'),
      });
    });

    it('should throw NotFoundException', async () => {
      jest.spyOn(prismaService.task, 'update').mockRejectedValue(null);

      await expect(taskService.remove(mockTask.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
