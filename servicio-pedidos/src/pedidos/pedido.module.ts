import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './pedido.entity.js';
import { DetallePedido } from './detalle-pedido.entity.js';
import { PedidoService } from './pedido.service.js';
import { PedidoController } from './pedido.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, DetallePedido])],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}