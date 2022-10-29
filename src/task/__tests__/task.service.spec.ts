import { Test, TestingModule } from '@nestjs/testing';
import { Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskService } from '../task.service';

const mockTask: Task = {
  id: 1,
  name: 'task name',
  description: 'description',
  priority: 2,
  isCompleted: false,
  completedAt: null,
  isDeleted: false,
  createdAt: '',
};

const prisma = {
  task: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
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
});
