import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateTaskInput {
  @IsString({ message: 'Название задачи должно быть строкой' })
  @Field({ nullable: false })
  name!: string;

  @IsOptional()
  @IsString({ message: 'Описание задачи должно быть строкой' })
  @Field({ nullable: true })
  description?: string;

  @IsOptional()
  @IsIn([1, 2, 3, 4], { message: 'Приоритет должен быть числом от 1 до 4' })
  @Field({ nullable: true })
  priority?: number;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Срок выполнения должен быть строкой в формате ISO 8601' },
  )
  deadline?: string;
}
