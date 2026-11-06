import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activa las validaciones de los DTOs automáticamente
  app.useGlobalPipes(new ValidationPipe());

  const PORT = process.env.PORT || 3002;
  await app.listen(PORT);
  console.log(`Servicio de Pedidos corriendo en el puerto ${PORT}`);
}
bootstrap();