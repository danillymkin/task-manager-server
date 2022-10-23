import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(createTaskInput: CreateTaskInput): Promise<Task> {
    return this.prisma.task.create({
      data: {
        name: createTaskInput.name,
        description: createTaskInput.description,
        priority: createTaskInput.priority,
        deadline: createTaskInput.deadline,
      },
    });
  }

  public async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }

  public async findOneById(id: number): Promise<Task> {
    try {
      return this.prisma.task.findUniqueOrThrow({ where: { id } });
    } catch (e) {
      throw new NotFoundException(`Задача с id: ${id} не найдена`);
    }
  }

  update(id: number, updateTaskInput: UpdateTaskInput) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
