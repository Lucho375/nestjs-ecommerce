import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtTokenType } from './types/jwt.types';

@Injectable()
export class JwtService {
  private readonly jwtService: NestJwtService;

  constructor(private readonly configService: ConfigService) {
    this.jwtService = new NestJwtService({
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  async sign(payload: any, type: JwtTokenType = 'access'): Promise<string> {
    const envVariable = type.toUpperCase();
    const secret = this.configService.get<string>(`${envVariable}_SECRET`);
    const expiresIn = `${envVariable}_EXPIRES`;
    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  async verify(token: string, type: JwtTokenType): Promise<any> {
    try {
      const secret = this.configService.get<string>(
        `${type.toUpperCase()}_SECRET`,
      );
      return await this.jwtService.verifyAsync(token, { secret });
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
