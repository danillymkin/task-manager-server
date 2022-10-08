import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule, PrismaModule],
})
export class AppModule {}
