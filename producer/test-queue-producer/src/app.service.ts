import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { queueConfig } from './config/queue.config';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(queueConfig.name)
    private readonly queue: Queue    
  ) {}

  async addToQueue(data: any) {
    console.log(`Adding message to queue: ${queueConfig.name} data: ${JSON.stringify(data)}`);
    const jobOptions = {
      attempts: 3,
      backoff: {
        type: 'fixed',
        delay: 2000
      }
    };
    try {
      const job = await this.queue.add(data, jobOptions);
      return {
        jobId: job.id,
        status: 'enqueued',
        data: job.data,
      };
    } catch (error) {
      throw new Error(`Error al encolar mensaje: ${error.message}`);
    }
  }
}