import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/products/schemas/product.schema';
import { User } from 'src/users/schemas/user.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop([
    {
      product: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ])
  items: { product: Product; quantity: number; price: number }[];

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({
    type: String,
    required: true,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: String, required: true })
  paymentId: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
