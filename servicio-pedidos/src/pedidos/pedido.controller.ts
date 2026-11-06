import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';

@Controller('api/pedidos')
export class PedidoController {
    constructor(private readonly pedidoService: PedidoService) {}
    @Get()
    getAll() {
    return this.pedidoService.listar();
}
@Get(':id')
getById(@Param('id') id: number) {
    return this.pedidoService.buscarPedidoPorId(id);
}

@Post()
create(@Body() crearPedidoDto: CrearPedidoDto) {
    return this.pedidoService.crear(crearPedidoDto);
}

@Delete(':id')
delete(@Param('id') id: number) {
    return this.pedidoService.eliminarPedido(id);
}
}