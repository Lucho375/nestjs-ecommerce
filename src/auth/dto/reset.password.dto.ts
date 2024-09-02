import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { PasswordMatchValidator } from 'src/users/validators/password.match.validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @Validate(PasswordMatchValidator, ['password'])
  confirmPassword: string;
}
