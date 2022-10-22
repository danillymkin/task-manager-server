import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Task {
  @Field(() => ID, { nullable: false })
  id!: number;
}
