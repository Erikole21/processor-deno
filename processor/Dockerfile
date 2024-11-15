FROM denoland/deno:alpine

WORKDIR /app

COPY processor .
COPY config.yaml .

# Asegurar permisos de ejecución en Linux
RUN chmod +x processor

CMD ["./processor"]