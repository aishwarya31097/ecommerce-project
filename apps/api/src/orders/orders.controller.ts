import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderFromCartDto } from './dto/create-order-from-cart.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(@Body() dto: CreateOrderFromCartDto) {
    return this.ordersService.checkout(dto);
  }

  /** Must stay above `:userId` — both use a single path segment. */
  @Get('detail/:orderId')
  findOne(@Param('orderId') orderId: string) {
    return this.ordersService.findOne(orderId);
  }

  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    return this.ordersService.findByUser(userId);
  }
}