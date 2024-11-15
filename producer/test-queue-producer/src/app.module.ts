import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { QueueService } from './app.service';
import { QueueController } from './app.controller';
import { queueConfig } from './config/queue.config';


@Module({
  imports: [    
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    BullModule.forRoot({
      redis: {
        host: queueConfig.redis.host,
        port: queueConfig.redis.port,
        db: queueConfig.redis.db,
      },
    }),
    BullModule.registerQueue({
      name: queueConfig.name,
    }),
  ],
  providers: [QueueService],
  controllers: [QueueController],
})
export class QueueModule {}