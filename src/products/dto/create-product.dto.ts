import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'El título es invalido' })
  @IsNotEmpty({ message: 'El título no puede estar vacío' })
  title: string;
}
