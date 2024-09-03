import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  private readonly accessSecret: string;
  private readonly emailConfirmationSecret: string;
  private readonly resetPasswordSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessSecret = this.configService.get<string>('JWT_SECRET');
    this.emailConfirmationSecret = this.configService.get<string>(
      'EMAIL_CONFIRMATION_SECRET',
    );
    this.resetPasswordSecret = this.configService.get<string>(
      'RESET_PASSWORD_SECRET',
    );
  }

  async signToken(
    payload: Record<string, any>,
    secret: string,
    expiresIn: string,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  async verifyToken<T extends object>(
    token: string,
    secret: string,
  ): Promise<T> {
    return this.jwtService.verifyAsync<T>(token, { secret });
  }

  getEmailConfirmationSecret() {
    return this.emailConfirmationSecret;
  }

  getResetPasswordSecret() {
    return this.resetPasswordSecret;
  }

  getAccessSecret() {
    return this.accessSecret;
  }
}
