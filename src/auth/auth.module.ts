import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EmailModule } from 'src/email/email.module';
import { HashModule } from 'src/hash/hash.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, { provide: APP_GUARD, useClass: AuthGuard }],
  imports: [UsersModule, HashModule, JwtModule, EmailModule],
})
export class AuthModule {}
