import { IsMongoId } from 'class-validator';

export class FindOneById {
  @IsMongoId({ message: 'El id es inválido' })
  id: string;
}
