import { config } from 'dotenv';

config();
export interface QueueConfig {
  name: string;
  redis: {
    host: string;
    port: number;
    db: number;
  };
}

export const queueConfig: QueueConfig = {
  name: process.env.QUEUE_NAME || 'default-queue',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    db: parseInt(process.env.REDIS_DB) || 4,
  },
};