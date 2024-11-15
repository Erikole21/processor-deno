import { Queue, Worker } from "npm:bullmq";
import { QueueService } from "./queue.interface.ts";
import { MessageProcessor } from "../processor/processor.interface.ts";
import { ConfigService } from "../config/config.service.ts";

export class BullQueueService implements QueueService {
  private queue!: Queue;
  private worker!: Worker;
  private config = ConfigService.getInstance().getConfig();

  async connect(): Promise<void> {
    this.queue = new Queue(this.config.queue.name, {
      connection: {
        host: this.config.redis.host,
        port: this.config.redis.port,
        db: this.config.redis.db,
      },
    });
  }

  async startProcessing(processor: MessageProcessor): Promise<void> {
    console.log("Starting worker for queue:", this.config.queue.name);
    this.worker = new Worker(
      this.config.queue.name,
      async (job:any) => {
        await processor.process(job.data);
      },
      {
        connection: {
          host: this.config.redis.host,
          port: this.config.redis.port,
          db: this.config.redis.db,
        },
        concurrency: this.config.queue.concurrency,
      }
    );

    this.worker.on('completed', (job:any) => {
      console.log(`Job ${job.id} completed successfully`);
    });

    this.worker.on('failed', (job:any, error:any) => {
      console.error(`Job ${job?.id} falló. Intento ${job?.attemptsMade} de ${job?.opts.attempts}:`, error);
      
      if (job?.attemptsMade === job?.opts.attempts) {
        console.error(`Job ${job.id} falló definitivamente después de ${job.opts.attempts} intentos`);
        // TODO: Implementar lógica para notificar a teams
      }
    });
  }

  async shutdown(): Promise<void> {
    await this.worker?.close();
    await this.queue?.close();
  }
}