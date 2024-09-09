import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().populate('user').populate('items.product');
  }

  async createOrder(orderData: any): Promise<Order> {
    return this.orderModel.create(orderData);
  }

  async findOne(orderId: string): Promise<Order> {
    const order = await this.orderModel.findById(orderId);
    if (!order)
      throw new NotFoundException(`Orden con id ${orderId} no encontrada`);
    return order;
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderModel.find({ user: userId });
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );

    if (!updatedOrder)
      throw new NotFoundException(`Orden con id ${orderId} no encontrada`);

    return updatedOrder;
  }
}
