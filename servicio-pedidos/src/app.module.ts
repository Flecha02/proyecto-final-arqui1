import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PedidoModule } from './pedidos/pedido.module.js';
import { Pedido } from './pedidos/pedido.entity.js';
import { DetallePedido } from './pedidos/detalle-pedido.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Pedido, DetallePedido],
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    PedidoModule,
  ],
})
export class AppModule {}