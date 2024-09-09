import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-preference')
  createPreference(@User('sub') userId: string) {
    return this.paymentsService.createPreference(userId);
  }

  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  handleWebhook(@Body() data: any, @Headers('x-signature') signature: string) {
    return this.paymentsService.handleWebhook(data, signature);
  }
}
