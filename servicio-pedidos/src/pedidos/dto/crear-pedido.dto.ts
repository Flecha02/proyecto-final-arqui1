import { IsInt, IsPositive, IsArray, ArrayNotEmpty, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';

export class ItemPedidoDto {
    @IsInt({ message: 'El ID del producto debe ser un numero entero' })
    @IsPositive({ message: 'El ID del producto debe ser mayor a 0' })
    productoId: number;

    @IsInt({ message: 'La cantidad debe ser un número entero' })
    @IsPositive({ message: 'La cantidad debe ser mayor a 0' })
    cantidad: number;
}

export class CrearPedidoDto {
    @IsArray({ message: 'Los items deben ser un arreglo' })
    @ArrayNotEmpty({ message: 'El pedido debe incluir al menos un producto' })
    @ValidateNested({ each: true })
    @Type(() => ItemPedidoDto)
    items: ItemPedidoDto[];
}
