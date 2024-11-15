Sistema de Cola de Mensajes Distribuido
Descripción General
Este es un sistema de cola de mensajes distribuido que utiliza una arquitectura de productor-consumidor. El proyecto está dividido en dos componentes principales:

1. Productor (Producer)
Desarrollado con NestJS
Expone una API REST para recibir mensajes
Utiliza Bull como biblioteca de cola de mensajes

Ejemplo del controlador:

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('message')
  async addMessage(@Body() message: any) {
    return await this.queueService.addToQueue(message);
  }
}

2. Procesador (Processor)

Desarrollado con Deno
Consume y procesa los mensajes de la cola
Implementa reintentos y manejo de errores

Ejemplo del procesador:

export class DefaultMessageProcessor implements MessageProcessor {
  async process(data: any): Promise<void> {
    try {
      console.log("Procesando mensaje:", data);
      if (data.data.error) {
        throw new Error('Error en el procesamiento del mensaje');
      }
    } catch (error) {
      console.error("Error procesando mensaje:", error);
      throw error;
    }
  }
}

Tecnologías Principales

Backend (Productor)

NestJS (Framework de Node.js)
Bull (Biblioteca de colas)
TypeScript
Redis (como almacenamiento de cola)

Procesador
Deno (Runtime de JavaScript/TypeScript)
BullMQ
TypeScript

Patrones de Diseño

1. Patrón Productor-Consumidor
    Separa la generación y el procesamiento de mensajes
2. Singleton
    Usado en el ConfigService:

    export class ConfigService {
    private static instance: ConfigService;
    private config: Config | null = null;

    private constructor() {}

    public static getInstance(): ConfigService {
        if (!ConfigService.instance) {
        ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }
    }

3. Inyección de Dependencias

Implementado en NestJS:

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
  ],
  providers: [QueueService],
  controllers: [QueueController],
})

4. Repository Pattern
    Para el manejo de la cola

5. Interface Segregation

export interface QueueService {
  connect(): Promise<void>;
  startProcessing(processor: MessageProcessor): Promise<void>;
  shutdown(): Promise<void>;
}

Características Destacadas

1. Manejo de Errores y Reintentos

async addToQueue(data: any) {
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

2. Configuración Centralizada

redis:
  host: "172.28.80.1"
  port: 6379  
  db: 4

queue:
  name: my-queue
  concurrency: 5
  
app:
  logLevel: "info"

3. Containerización

FROM denoland/deno:alpine

WORKDIR /app

COPY processor .
COPY config.yaml .

RUN chmod +x processor

CMD ["./processor"]

4. Graceful Shutdown

const shutdown = async () => {
  console.log("Cerrando aplicación...");
  await queueService.shutdown();
  Deno.exit(0);
};

Deno.addSignalListener("SIGINT", shutdown);
if (Deno.build.os !== "windows") {
  Deno.addSignalListener("SIGTERM", shutdown);
}

Configuración del Proyecto
Productor

1  Instalar dependencias:
    npm install

2. Configurar variables de entorno en .env
    REDIS_HOST=localhost
    REDIS_PORT=6379
    QUEUE_NAME=my-queue
    REDIS_DB=4

3. npm run start

Procesador

1. Asegurar que Deno está instalado
  https://docs.deno.com/runtime/getting_started/installation/
2. Configurar config.yaml
  redis:
    host: "172.28.80.1" // ip donde se vea el servidor redis
    port: 6379  
    db: 4

  queue:
    name: my-queue
    concurrency: 5
    
  app:
    logLevel: "info"
  
3 Ejecutar:
 deno run --allow-net --allow-read --allow-env --allow-ffi src/main.ts



Construcción y Despliegue
    
Procesador

Ejecutar dentro de processor

1: .\build.bat
2:  docker run -d --name processor processor:latest
3:  docker logs -f processor








