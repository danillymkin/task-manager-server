import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { ParseIntPipe } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Query(() => [User], { name: 'findAllUsers' })
  findAll() {
    return this.userService.findAll();
  }

  @Auth()
  @Query(() => User, { name: 'findUserById' })
  findOneById(@Args('id', { type: () => ID }, ParseIntPipe) id: number) {
    return this.userService.findOneById(id);
  }

  @Auth()
  @Query(() => User, { name: 'findUserByEmail' })
  findOneByEmail(@Args('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @Auth()
  @Query(() => User, { name: 'findUserByNickName' })
  findOneByNickName(@Args('nickName') nickName: string) {
    return this.userService.findOneByNickName(nickName);
  }
}
