import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { PasswordMatchValidator } from '../validators/password.match.validator';
import { Role } from 'src/common/enums/roles.enum';

export class CreateUserDto {
  @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
  email: string;

  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre tiene que ser una cadena de caracteres' })
  firstName: string;

  @IsNotEmpty({ message: 'El apellido es requerido' })
  @IsString({ message: 'El apellido tiene que ser una cadena de caracteres' })
  lastName: string;

  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @IsString({ message: 'La contraseña tiene que ser una cadena de caracteres' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @IsString({
    message:
      'La confirmación de contraseña tiene que ser una cadena de caracteres',
  })
  @Validate(PasswordMatchValidator, ['password'])
  confirmPassword: string;
}

export class CreateAdminUserDto extends CreateUserDto {
  @IsNotEmpty({ message: 'El rol es requerido' })
  @IsEnum(Role)
  @IsString({ message: 'El rol tiene que ser una cadena de caracteres' })
  role: Role;
}
