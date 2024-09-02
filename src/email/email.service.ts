import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { TemplateService } from 'src/email/template.service';
import { IEmailConfirmationTemplate } from './interfaces/email.confirmation.template.interface';
import { ILoginFailedTemplate } from './interfaces/login.failed.template';
import { IResetPasswordTemplate } from './interfaces/reset.password.template';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly emailDomain: string;
  private readonly companyName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly templateService: TemplateService,
  ) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
    this.emailDomain = this.configService.get<string>('EMAIL_DOMAIN');
    this.companyName = this.configService.get<string>('COMPANY_NAME');
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      await this.resend.emails.send({
        to,
        subject,
        from: 'delivered@resend.dev',
        html,
      });
      return { message: 'Email enviado exitosamente' };
    } catch (error) {
      throw new InternalServerErrorException('Error al enviar el email');
    }
  }

  async sendUserEmailConfirmation(
    to: string,
    confirmationUrl: string,
    firstName: string,
  ) {
    try {
      const html =
        await this.templateService.compileTemplate<IEmailConfirmationTemplate>(
          'email-confirmation',
          {
            confirmationUrl,
            companyDomain: this.emailDomain,
            companyName: this.companyName,
            firstName,
            year: new Date().getFullYear(),
          },
        );
      return this.sendEmail(to, 'Confirmación de email', html);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al enviar el email de confirmación de cuenta',
      );
    }
  }

  async sendFailedLoginAttempt(to: string) {
    try {
      const html =
        await this.templateService.compileTemplate<ILoginFailedTemplate>(
          'login-failed',
          {
            companyDomain: this.emailDomain,
            companyName: this.companyName,
            year: new Date().getFullYear(),
          },
        );
      return this.sendEmail(to, 'Inicio de sesión fallido', html);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al enviar el email de intento de inicio de sesión fallido',
      );
    }
  }

  async sendResetPasswordEmail(
    to: string,
    resetPasswordLink: string,
    firstName: string,
  ) {
    try {
      const html =
        await this.templateService.compileTemplate<IResetPasswordTemplate>(
          'reset-password',
          {
            companyName: this.companyName,
            firstName,
            year: new Date().getFullYear(),
            resetPasswordLink,
          },
        );
      return this.sendEmail(
        to,
        'Solicitud de restauración de contraseña',
        html,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al enviar el email de restauración de contraseña',
      );
    }
  }
}
