import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginCredentials {
  @IsEmail({}, { message: 'El formato del correo electrónico es inválido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @IsString({ message: 'La contraseña tiene que ser una cadena de caracteres' })
  password: string;
}
