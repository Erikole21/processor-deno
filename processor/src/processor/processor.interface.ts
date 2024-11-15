export interface MessageProcessor {
    process(data: unknown): Promise<void>;
  }