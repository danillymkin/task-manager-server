import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [CoreModule, PrismaModule, AuthModule, UserModule, TokenModule],
})
export class AppModule {}
