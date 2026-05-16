import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import type { AuthUser } from '@/auth/types/auth-user.type';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(@CurrentUser() user: AuthUser) {
    return this.ordersService.checkout(user.id);
  }

  @Get('me')
  findMine(@CurrentUser() user: AuthUser) {
    return this.ordersService.findByUser(user.id);
  }

  /** Must stay below `me`, above nothing else with one segment. */
  @Get('detail/:orderId')
  findOne(
    @CurrentUser() user: AuthUser,
    @Param('orderId') orderId: string,
  ) {
    return this.ordersService.findOne(orderId, user.id);
  }
}