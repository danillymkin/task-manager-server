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
      return await this.prisma.task.findUniqueOrThrow({ where: { id } });
    } catch (e) {
      throw new NotFoundException(`Задача с id: ${id} не найдена`);
    }
  }

  public async update(updateTaskInput: UpdateTaskInput): Promise<Task> {
    try {
      return await this.prisma.task.update({
        where: { id: updateTaskInput.id },
        data: {
          name: updateTaskInput.name,
          description: updateTaskInput.description,
          priority: updateTaskInput.priority,
          deadline: updateTaskInput.deadline,
        },
      });
    } catch (e) {
      throw new NotFoundException(
        `Задача с id: ${updateTaskInput.id} не найдена`,
      );
    }
  }

  public async remove(id: number): Promise<Task> {
    try {
      return await this.prisma.task.update({
        where: { id },
        data: {
          isDeleted: true,
        },
      });
    } catch (e) {
      throw new NotFoundException(`Задача с id: ${id} не найдена`);
    }
  }
}
