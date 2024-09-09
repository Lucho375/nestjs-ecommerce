import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOrder(@Param('id') orderId: string) {
    return this.ordersService.getOrder(orderId);
  }
}
