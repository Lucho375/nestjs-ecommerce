import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'El título es invalido' })
  @IsNotEmpty({ message: 'El título no puede estar vacío' })
  title: string;

  @IsString({ message: 'La descripción es invalida' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  description: string;

  @Type(() => Number)
  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsNumber({}, { message: 'El precio tiene que ser un número' })
  price: number;

  @IsNotEmpty({ message: 'La categoria es requerida' })
  @IsString()
  category: string;

  @Type(() => Number)
  @IsNotEmpty({ message: 'El stock es requerido' })
  @IsNumber({}, { message: 'El stock tiene que ser un número' })
  stock: number;

  isActive: boolean;
}
