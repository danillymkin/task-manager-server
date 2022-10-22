import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTaskInput {
  @Field({ nullable: false })
  name: string;
}
