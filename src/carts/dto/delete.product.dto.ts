import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DeleteProductInCartDto {
  @IsMongoId()
  @IsNotEmpty()
  product: string;
}
