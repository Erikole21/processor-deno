export interface RedisConfig {
    host: string;
    port: number;
    db: number;
  }
  
  export interface QueueConfig {
    name: string;
    concurrency: number;
  }
  
  export interface AppConfig {
    logLevel: string;
  }
  
  export interface Config {
    redis: RedisConfig;
    queue: QueueConfig;
    app: AppConfig;
  }