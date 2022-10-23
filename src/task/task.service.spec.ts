import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from './entities/task.entity';

const mockTask: Task = {
  id: 1,
  name: 'New task',
  description: 'New task',
  priority: 3,
  deadline: new Date(),
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const prisma = {
  task: {
    findMany: jest.fn(),
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
});
