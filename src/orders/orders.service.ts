import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async createOrder(orderData: any) {
    return this.orderModel.create(orderData);
  }

  async getOrder(orderId: string) {
    return this.orderModel.findById(orderId);
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );
  }
}
