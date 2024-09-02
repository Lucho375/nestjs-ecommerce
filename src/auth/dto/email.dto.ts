import { IsEmail } from 'class-validator';

export class EmailDto {
  @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
  email: string;
}
