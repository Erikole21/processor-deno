import { ConfigService } from "./config/config.service.ts";
import { BullQueueService } from "./queue/queue.service.ts";
import { DefaultMessageProcessor } from "./processor/message.processor.ts";

async function bootstrap() {
  try {
    // Inicializar configuración
    const configService = ConfigService.getInstance();
    await configService.loadConfig();

    // Inicializar servicios
    const queueService = new BullQueueService();
    const messageProcessor = new DefaultMessageProcessor();

    // Conectar y comenzar procesamiento
    await queueService.connect();
    await queueService.startProcessing(messageProcessor);

    console.log("Consumidor iniciado y esperando mensajes...");

    // Manejo de señales para shutdown graceful
    const shutdown = async () => {
      console.log("Cerrando aplicación...");
      await queueService.shutdown();
      Deno.exit(0);
    };

    Deno.addSignalListener("SIGINT", shutdown);
    if (Deno.build.os !== "windows") {
      Deno.addSignalListener("SIGTERM", shutdown);
    }

  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
    Deno.exit(1);
  }
}

bootstrap();