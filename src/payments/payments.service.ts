import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { CartsService } from 'src/carts/carts.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PaymentsService {
  private readonly client: MercadoPagoConfig;
  constructor(
    private readonly configService: ConfigService,
    private readonly cartsService: CartsService,
  ) {
    this.client = new MercadoPagoConfig({
      accessToken: this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN'),
    });
  }

  async createPreference(userId: string) {
    try {
      const { items } = await this.cartsService.checkout(userId);
      const preference = new Preference(this.client);
      const { init_point } = await preference.create({
        body: {
          items,
        },
        requestOptions: {
          idempotencyKey: uuid(),
        },
      });

      return {
        init_point,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al crear la preferencia de pago',
      );
    }
  }

  async handleWebhook(data: any, signature: string) {
    if (!this.verifySignature(data, signature))
      throw new UnauthorizedException();
  }

  // eslint-disable-next-line
  private verifySignature(body: any, signature: string): boolean {
    // TODO: implement verify webhook
    return true;
  }
}
