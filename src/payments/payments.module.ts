import { Module } from '@nestjs/common';
import { CartsModule } from 'src/carts/carts.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  providers: [PaymentsService],
  controllers: [PaymentsController],
  imports: [CartsModule],
})
export class PaymentsModule {}
