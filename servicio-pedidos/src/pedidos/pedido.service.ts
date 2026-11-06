import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './pedido.entity.js';
import { DetallePedido } from './detalle-pedido.entity.js';
import { CrearPedidoDto } from './dto/crear-pedido.dto.js';
import axios from 'axios';

@Injectable()
export class PedidoService {
  private productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001/api/products';

  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(DetallePedido)
    private readonly detalleRepository: Repository<DetallePedido>,
  ) {}

async listar(): Promise<Pedido[]> {
    return await this.pedidoRepository.find({ 
      relations: { detalles: true } as any 
    });
  }

async buscarPedidoPorId(id: number): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { id },
      relations: { detalles: true } as any,
    });

    if (!pedido) {
      throw new NotFoundException('No existe este pedido');
    }

    return pedido;
  }

  async crear(dto: CrearPedidoDto): Promise<any> {
    try {
      let totalPedido = 0;
      const detallesPreparados: any[] = [];

      // 1. Validar stock y calcular subtotales para cada producto del arreglo
      for (const item of dto.items) {
        const productoResponse = await axios.get(`${this.productServiceUrl}/${item.productoId}`);
        const producto = productoResponse.data;

        if (producto.stock < item.cantidad) {
          throw new HttpException(
            `Stock insuficiente para el producto con ID ${item.productoId}. Stock actual: ${producto.stock}`,
            HttpStatus.BAD_REQUEST,
          );
        }

        const subtotal = producto.precio * item.cantidad;
        totalPedido += subtotal;

        detallesPreparados.push({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: producto.precio,
          subtotal,
        });
      }

      // 2. Descontar stock de cada producto en el Servicio de Productos
      for (const item of dto.items) {
        await axios.patch(`${this.productServiceUrl}/${item.productoId}/discount`, {
          cantidad: item.cantidad,
        });
      }

      // 3. Guardar el pedido maestro y sus detalles en cascada
      const nuevoPedido = this.pedidoRepository.create({
        total: totalPedido,
        estado: 'COMPLETADO',
        detalles: detallesPreparados,
      });

      const pedidoGuardado = await this.pedidoRepository.save(nuevoPedido);

      return {
        message: 'Pedido maestro-detalle creado exitosamente',
        pedido: pedidoGuardado,
      };
    } catch (error: any) {
      if (error.response) {
        throw new HttpException(
          error.response.data.error || 'Error al comunicarse con el servicio de productos',
          error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(error.message || 'Error interno en el servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async eliminarPedido(id: number): Promise<Pedido> {
    const pedido = await this.buscarPedidoPorId(id);
    pedido.estado = 'CANCELADO';
    return await this.pedidoRepository.save(pedido);
  }
}