import { ConfigModule } from '@app/shared/module/config/config.module';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PersistenceModule {}
