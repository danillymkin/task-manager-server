import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class LoginResponse {
  @Field()
  readonly accessToken: string;

  @Field(() => User)
  readonly user: User;
}
