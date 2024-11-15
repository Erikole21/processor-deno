import { MessageProcessor } from "../processor/processor.interface.ts";

export interface QueueService {
  connect(): Promise<void>;
  startProcessing(processor: MessageProcessor): Promise<void>;
  shutdown(): Promise<void>;
}