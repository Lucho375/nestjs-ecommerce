import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { HashService } from 'src/hash/hash.service';
import { TokenEnum } from 'src/token/enums/token.enum';
import { TokenService } from 'src/token/token.service';
import { CreateUserDto } from 'src/users/dto';
import { UsersService } from 'src/users/users.service';
import { LoginCredentials, ResetPasswordDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

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
      role: user.role,
    };

    return {
      accessToken: await this.tokenService.signToken(
        payload,
        TokenEnum.ACCESS_SECRET,
      ),
      refreshToken: await this.tokenService.signToken(
        payload,
        TokenEnum.REFRESH_SECRET,
      ),
    };
  }

  async verifyUser(token: string) {
    try {
      const decodedToken = await this.tokenService.verifyToken<{
        email: string;
      }>(token, TokenEnum.EMAIL_CONFIRMATION_SECRET);

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
      const confirmationToken = await this.tokenService.signToken(
        { email },
        TokenEnum.EMAIL_CONFIRMATION_SECRET,
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

      const token = await this.tokenService.signToken(
        { sub: user.id },
        TokenEnum.PASSWORD_RESET_SECRET,
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
      const { sub } = await this.tokenService.verifyToken<{ sub: string }>(
        token,
        TokenEnum.PASSWORD_RESET_SECRET,
      );

      await this.usersService.update(sub, password);

      return { message: 'Contraseña cambiada exitosamente' };
    } catch (error) {
      throw new BadRequestException(
        'Token de verificación inválido o expirado',
      );
    }
  }

  async refreshToken(token: string) {
    try {
      const { sub, email, firstName } = await this.tokenService.verifyToken<{
        sub: string;
        email: string;
        firstName: string;
        iat: number;
        exp: number;
      }>(token, TokenEnum.REFRESH_SECRET);

      const newAccessToken = await this.tokenService.signToken(
        { sub, email, firstName },
        TokenEnum.ACCESS_SECRET,
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException(
        'Token de refresco inválido o expirado!!!',
      );
    }
  }
}
