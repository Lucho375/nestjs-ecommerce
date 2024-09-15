import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Command, CommandRunner, Option } from 'nest-commander';
import { AppModule } from 'src/app.module';
import { Role } from 'src/common/enums/roles.enum';
import { CreateAdminUserDto } from 'src/users/dto';
import { UsersService } from 'src/users/users.service';

@Command({ name: 'create-admin', description: 'A parameter parse' })
export class CreateAdminUser extends CommandRunner {
  private readonly logger = new Logger(CreateAdminUser.name);

  async run(
    passedParam: string[],
    options?: CreateAdminUserDto,
  ): Promise<void> {
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: this.logger,
    });
    try {
      const usersService = app.get(UsersService);
      const adminExists = await usersService.findOne({ role: Role.ADMIN });
      if (adminExists) {
        this.logger.error('Ya existe un usuario admin.');
        return;
      }

      const createAdminUserDto = plainToInstance(CreateAdminUserDto, {
        ...options,
        role: Role.ADMIN,
      });

      const errors = await validate(createAdminUserDto);
      if (errors.length > 0) {
        this.logger.error(
          'Errores de validación: \n' +
            errors
              .map(
                (err) =>
                  `\n Property: ${err.property}, \n Constraints: ${JSON.stringify(err.constraints, null, 2)}`,
              )
              .join(', '),
        );
        return;
      }
      await usersService.create({
        ...createAdminUserDto,
      });
      this.logger.log(
        `Usuario ${options.firstName} ${options.lastName} creado.`,
      );
    } catch (error) {
      this.logger.error(`Error al ejecutar el comando : ${error.message}`);
    } finally {
      await app.close();
    }
  }

  @Option({
    flags: '-e, --email <email>',
    description: 'Email del usuario',
  })
  parseEmail(val: string): string {
    return val;
  }

  @Option({
    flags: '-f, --firstName <firstName>',
    description: 'Nombre del usuario',
  })
  parseFirstName(val: string): string {
    return val;
  }

  @Option({
    flags: '-l, --lastName <lastName>',
    description: 'Apellido del usuario',
  })
  parseLastName(val: string): string {
    return val;
  }

  @Option({
    flags: '-p, --password <password>',
    description: 'Contraseña del usuario',
  })
  parsePassword(val: string): string {
    return val;
  }

  @Option({
    flags: '-cp, --confirmPassword <confirmPassword>',
    description: 'Confirmación de contraseña',
  })
  parseConfirmPassword(val: string): string {
    return val;
  }
}
