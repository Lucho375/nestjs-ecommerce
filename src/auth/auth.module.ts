import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EmailModule } from 'src/email/email.module';
import { HashModule } from 'src/hash/hash.module';
import { TokenModule } from 'src/token/token.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, { provide: APP_GUARD, useClass: AuthGuard }],
  imports: [UsersModule, HashModule, EmailModule, TokenModule],
})
export class AuthModule {}
