import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLDateTime } from 'graphql-scalars';

@ObjectType()
export class Task {
  @Field(() => ID, { nullable: false })
  id!: number;

  @Field({ nullable: false })
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int, { nullable: false })
  priority!: number;

  @Field(() => GraphQLDateTime, { nullable: true })
  deadline?: string | Date;

  @Field(() => GraphQLDateTime, { nullable: true })
  completedAt?: string | Date;

  @Field({ nullable: false })
  isDeleted!: boolean;

  @Field(() => GraphQLDateTime, { nullable: false })
  createdAt!: string | Date;

  @Field(() => GraphQLDateTime, { nullable: false })
  updatedAt!: string | Date;

  @Field(() => GraphQLDateTime, { nullable: true })
  deletedAt?: string | Date;
}
