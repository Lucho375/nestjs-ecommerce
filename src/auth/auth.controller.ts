import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { Cookies } from 'src/common/decorators/cookies.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDto } from 'src/users/dto/create.user.dto';
import { AuthService } from './auth.service';
import { LoginCredentials, TokenDto } from './dto';
import { EmailDto } from './dto/email.dto';
import { ResetPasswordDto } from './dto/reset.password.dto';

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
  async login(
    @Body() loginCredentials: LoginCredentials,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginCredentials);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.send({ accessToken });
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Cookies('refreshToken') refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException();
    return this.authService.refreshToken(refreshToken);
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
