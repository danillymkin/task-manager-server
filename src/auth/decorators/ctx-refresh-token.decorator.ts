import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CtxRefreshToken = createParamDecorator(
  (data, ctx) =>
    GqlExecutionContext.create(ctx).getContext().req?.cookies?.refreshToken,
);
