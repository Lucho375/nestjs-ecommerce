import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';

export class CartItemDto {
  @IsMongoId()
  @IsNotEmpty()
  product: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'La cantidad mínima permitida es 1' })
  quantity: number;
}

export class CreateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
