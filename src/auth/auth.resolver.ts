import { AuthService } from './auth.service';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginResponse } from './dto/login.response';
import { LoginInput } from './dto/login.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { CtxUser } from './decorators/ctx-user.decorator';
import { RegisterInput } from './dto/register.input';
import { CtxRefreshToken } from './decorators/ctx-refresh-token.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() context,
    @CtxUser() user,
  ): Promise<LoginResponse> {
    return this.authService.login(user, context.res);
  }

  @Mutation(() => LoginResponse)
  register(
    @Args('registerInput') registerInput: RegisterInput,
    @Context() context,
  ) {
    return this.authService.register(registerInput, context.res);
  }

  @Query(() => LoginResponse, { name: 'refresh' })
  refresh(@CtxRefreshToken() refreshToken: string, @Context() context) {
    return this.authService.refresh(refreshToken, context.res);
  }

  @Query(() => LoginResponse, { nullable: true })
  public logout(
    @CtxRefreshToken() refreshToken: string,
    @Context() context,
  ): Promise<void> {
    return this.authService.logout(refreshToken, context.res);
  }
}
