import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { CartsService } from './carts.service';
import { CartItemDto, CreateCartDto } from './dto/create.cart.dto';
import { DeleteProductInCartDto } from './dto/delete.product.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createCart(
    @Body() createCartDto: CreateCartDto,
    @User('sub') userId: string,
  ) {
    return this.cartsService.createCart(createCartDto, userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getCartByUserId(@User('sub') userId: string) {
    return this.cartsService.getCartByUserId(userId);
  }

  @Post('add-item')
  @HttpCode(HttpStatus.CREATED)
  addItemToCart(@Body() cartItemDto: CartItemDto, @User('sub') userId: string) {
    return this.cartsService.addItemToCart(cartItemDto, userId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateCart(@Param('id') id: string, @Body() updateCartDto: CartItemDto) {
    return this.cartsService.updateCart(id, updateCartDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteItemFromCart(
    @Param('id') id: string,
    @Body() deleteProduct: DeleteProductInCartDto,
  ) {
    return this.cartsService.deleteItemFromCart(id, deleteProduct.product);
  }

  @Delete(':id/clear')
  @HttpCode(HttpStatus.OK)
  clearCart(@Param('id') id: string) {
    return this.cartsService.clearCart(id);
  }

  @Get(':id/total')
  @HttpCode(HttpStatus.OK)
  getTotalPrice(@Param('id') id: string) {
    return this.cartsService.getTotalPrice(id);
  }
}
