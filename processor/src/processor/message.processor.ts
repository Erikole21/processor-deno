import { MessageProcessor } from "./processor.interface.ts";

export class DefaultMessageProcessor implements MessageProcessor {
  async process(data: any): Promise<void> {
    try {
      console.log("Procesando mensaje:", data);
      // Implementa aquí tu lógica de procesamiento
      if (data.data.error) {
        throw new Error('Error en el procesamiento del mensaje');
      }
    } catch (error) {
      console.error("Error procesando mensaje:", error);
      // Al lanzar la excepción, Bull manejará el reintento según la configuración
      throw error;
    }
  }
}