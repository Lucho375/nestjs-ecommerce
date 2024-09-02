import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create.user.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators';
import { LoginCredentials, TokenDto } from './dto';
import { ResetPasswordDto } from './dto/reset.password.dto';
import { EmailDto } from './dto/email.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerUserDto: CreateUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginCredentials: LoginCredentials) {
    return this.authService.login(loginCredentials);
  }

  @Get('verify')
  @HttpCode(HttpStatus.OK)
  verifyUserEmail(@Query() { token }: TokenDto) {
    return this.authService.verifyUser(token);
  }

  @Get('resend-confirmation')
  @HttpCode(HttpStatus.OK)
  resendConfirmationEmail(@Req() req) {
    return this.authService.resendConfirmationEmail(req.user.email);
  }

  @Public()
  @Get('request-password-reset')
  @HttpCode(HttpStatus.OK)
  sendResetPasswordEmail(@Body() { email }: EmailDto) {
    return this.authService.sendResetPasswordEmail(email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @Query() { token }: TokenDto,
    @Body() passwords: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, passwords);
  }
}
