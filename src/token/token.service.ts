import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenEnum } from './enums/token.enum';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signToken(
    payload: Record<string, any>,
    secretType: TokenEnum,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.getSecret(secretType),
      expiresIn: '5m',
    });
  }

  async verifyToken<T extends object>(
    token: string,
    secretType: TokenEnum,
  ): Promise<T> {
    return this.jwtService.verifyAsync<T>(token, {
      secret: this.getSecret(secretType),
    });
  }

  private getSecret(token: TokenEnum): string {
    const secret = this.configService.get<string>(token);
    return secret;
  }
}
