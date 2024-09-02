import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'match', async: false })
export class PasswordMatchValidator implements ValidatorConstraintInterface {
  validate(
    confirmPassword: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const [constraintField] = validationArguments.constraints;
    const password = validationArguments.object[constraintField];
    return password === confirmPassword;
  }

  defaultMessage?(
    validationArguments?: ValidationArguments /* eslint-disable-line */,
  ): string {
    return 'Las contraseñas no coinciden';
  }
}
