import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLDateTime } from 'graphql-scalars';

@ObjectType()
export class User {
  @Field(() => ID, { nullable: false })
  id!: number;

  @Field({ nullable: false })
  email!: string;

  @Field({ nullable: false })
  nickName!: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  bio?: string;

  password: string;

  @Field(() => GraphQLDateTime, { nullable: false })
  createdAt: string | Date;
}
