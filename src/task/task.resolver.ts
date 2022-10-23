import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

@Resolver(() => Task)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation(() => Task)
  createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ): Promise<Task> {
    return this.taskService.create(createTaskInput);
  }

  @Query(() => [Task], { name: 'tasks' })
  findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Query(() => Task, { name: 'task' })
  findOneById(@Args('id', { type: () => Int }) id: number): Promise<Task> {
    return this.taskService.findOneById(id);
  }

  @Mutation(() => Task)
  updateTask(
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
  ): Promise<Task> {
    return this.taskService.update(updateTaskInput);
  }

  @Mutation(() => Task)
  removeTask(@Args('id', { type: () => Int }) id: number): Promise<Task> {
    return this.taskService.remove(id);
  }
}
