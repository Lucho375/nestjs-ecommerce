import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { HashService } from 'src/hash/hash.service';
import { CreateUserDto } from 'src/users/dto';
import { UsersService } from 'src/users/users.service';
import { LoginCredentials, ResetPasswordDto } from './dto';

@Injectable()
export class AuthService {
  private readonly emailConfirmationSecret: string;
  private readonly resetPasswordSecret: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {
    this.emailConfirmationSecret = this.configService.get<string>(
      'EMAIL_CONFIRMATION_SECRET',
    );
    this.resetPasswordSecret = this.configService.get<string>(
      'RESET_PASSWORD_SECRET',
    );
  }

  async register(registerUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(registerUserDto);
    const { password, ...result } = newUser.toObject(); // eslint-disable-line
    return result;
  }

  async login(loginCredentials: LoginCredentials) {
    const user = await this.usersService.findOneByEmail(loginCredentials.email);

    if (!user) throw new BadRequestException('El usuario no existe');

    const isValidPassword = await this.hashService.compare(
      loginCredentials.password,
      user.password,
    );

    if (!isValidPassword) {
      await this.emailService.sendFailedLoginAttempt(user.email);
      throw new UnauthorizedException('Unauthorized');
    }

    const payload = {
      sub: user._id.toString(),
      firstName: user.firstName,
      email: user.email,
    };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  async verifyUser(token: string) {
    try {
      const decodedToken = await this.jwtService.verifyAsync<{
        email: string;
      }>(token, { secret: this.emailConfirmationSecret });

      const user = await this.usersService.findOneByEmail(decodedToken.email);

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      await this.usersService.confirmUser(user.id);
      return {
        message: 'Cuenta confirmada exitosamente.',
      };
    } catch (error) {
      throw new BadRequestException(
        'Token de verificación inválido o expirado',
      );
    }
  }

  async resendConfirmationEmail(email: string) {
    try {
      const user = await this.usersService.findOneByEmail(email);
      const confirmationToken = await this.jwtService.signAsync(
        { email },
        { expiresIn: '5m', secret: this.emailConfirmationSecret },
      );
      return this.emailService.sendUserEmailConfirmation(
        email,
        confirmationToken,
        user.firstName,
      );
    } catch (error) {
      throw new BadRequestException(
        'Error al reenviar el email de confirmación',
      );
    }
  }

  async sendResetPasswordEmail(email: string) {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (!user) throw new NotFoundException('Usuario no encontrado');

      const token = await this.jwtService.signAsync(
        { sub: user.id },
        { secret: this.resetPasswordSecret, expiresIn: '5m' },
      );
      const resetPasswordLink = `${token}`;

      return this.emailService.sendResetPasswordEmail(
        email,
        resetPasswordLink,
        user.firstName,
      );
    } catch (error) {
      throw new InternalServerErrorException('Error al enviar el email');
    }
  }

  async resetPassword(token: string, password: ResetPasswordDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<{ sub: string }>(
        token,
        { secret: this.resetPasswordSecret },
      );

      await this.usersService.update(sub, password);

      return { message: 'Contraseña cambiada exitosamente' };
    } catch (error) {
      throw new BadRequestException(
        'Token de verificación inválido o expirado',
      );
    }
  }
}
