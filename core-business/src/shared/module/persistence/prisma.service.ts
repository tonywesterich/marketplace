import { ConfigService } from '@app/shared/module/config/config.service';
import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  private logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('database.url'),
        },
      },
    });
    // eslint-disable-next-line no-console
    console.log(
      'PrismaService -> configService.get("database.url"):',
      configService.get('database.url'),
    );
  }

  async onModuleInit() {
    this.logger.log({
      message: 'Connecting to Prisma on database module initialization',
    });

    await this.$connect();
  }

  async onModuleDestroy() {
    this.logger.log({
      message: 'Disconnecting from Prisma on module destroy',
    });

    await this.$disconnect();
  }

  onApplicationShutdown(signal: string) {
    this.logger.log({
      message: 'Disconnecting from Prisma on application shutdown',
      signal,
    });

    this.$disconnect();
  }
}
