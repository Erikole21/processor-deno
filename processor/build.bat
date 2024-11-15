@echo off

:: Limpiar archivos anteriores
del /F processor 2>nul

:: Construir la imagen de compilación
docker build -f Dockerfile.build -t processor-builder .

:: Extraer el binario y limpiar
docker create --name temp processor-builder
docker cp temp:/app/processor ./processor
docker rm temp

:: Construir la imagen de producción
docker build -t processor:latest .

echo Compilación completada. El binario 'processor' ha sido generado.