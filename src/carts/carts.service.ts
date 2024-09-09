import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument } from 'src/products/schemas/product.schema';
import { CartItemDto, CreateCartDto } from './dto/create.cart.dto';
import { Cart } from './schemas/cart.schema';

@Injectable()
export class CartsService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

  async createCart(createCartDto: CreateCartDto, userId: string) {
    const cartExists = await this.getCartByUserId(userId);
    if (cartExists) throw new BadRequestException('El carrito ya existe');
    return this.cartModel.create({ ...createCartDto, user: userId });
  }

  getCartByUserId(id: string) {
    return this.cartModel.findOne({ user: id });
  }

  async addItemToCart(cartItemDto: CartItemDto, userId: string) {
    const { product, quantity } = cartItemDto;

    const cart = await this.cartModel.findOne({
      user: userId,
      'items.product': product,
    });

    if (cart) {
      return this.cartModel.findOneAndUpdate(
        {
          user: userId,
          'items.product': product,
        },
        { $inc: { 'items.$.quantity': quantity } },
        { new: true },
      );
    }

    return this.cartModel.findOneAndUpdate(
      { user: userId },
      {
        $push: { items: cartItemDto },
      },
      { new: true, upsert: true },
    );
  }

  updateCart(id: string, updateCartDto: CartItemDto) {
    return this.cartModel.findOneAndUpdate(
      { _id: id, 'items.product': updateCartDto.product },
      {
        $set: { 'items.$.quantity': updateCartDto.quantity },
      },
      { new: true },
    );
  }

  async deleteItemFromCart(cartId: string, itemId: string) {
    await this.cartModel.findOneAndUpdate(
      {
        _id: cartId,
      },
      {
        $pull: { items: { product: itemId } },
      },
      { new: true },
    );
    await this.getTotalPrice(cartId);
  }

  clearCart(cartId: string) {
    return this.cartModel.findOneAndUpdate(
      {
        _id: cartId,
      },
      {
        $set: { items: [], totalPrice: 0 },
      },
      { new: true },
    );
  }

  async getTotalPrice(cartId: string) {
    const cart = await this.cartModel
      .findById(cartId)
      .populate('items.product');

    if (!cart || !cart.items.length) {
      cart.totalPrice = 0;
      await cart.save();
      return 0;
    }

    const total = cart.items.reduce((acum, item) => {
      return acum + item.product.price * item.quantity;
    }, 0);

    cart.totalPrice = total;
    await cart.save();

    return total;
  }

  async checkout(userId) {
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product');

    if (!cart || !cart.items.length)
      throw new BadRequestException('El carrito no existe o esta vacío');

    const items = cart.items.map((item) => {
      const product = item.product as ProductDocument;

      return {
        id: product._id.toString(),
        unit_price: product.price,
        quantity: item.quantity,
        title: product.title,
      };
    });

    return { items };
  }
}
