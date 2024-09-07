import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/products/schemas/product.schema';
import { User } from 'src/users/schemas/user.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop([
    {
      product: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ])
  items: { product: Product; quantity: number }[];

  @Prop({ type: Number, default: 0 })
  totalPrice: number;

  @Prop({ default: false })
  isOrdered: boolean;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
