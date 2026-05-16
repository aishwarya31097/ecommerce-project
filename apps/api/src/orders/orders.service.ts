import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async checkout(userId: string) {
   
    return this.prisma.$transaction(async (tx) => {
      const cartItems = await tx.cartItem.findMany({
        where: { userId: userId },
        include: {
          product: {
            select: { id: true, name: true, price: true },
          },
        },
      });

      if (cartItems.length === 0) {
        throw new BadRequestException('Cannot checkout an empty cart');
      }

      const total = cartItems.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0,
      );

      const order = await tx.order.create({
        data: {
          userId: userId,
          status: OrderStatus.PENDING,
          total,
        },
      });

      await tx.orderItem.createMany({
        data: cartItems.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.product.price,
          productName: item.product.name,
        })),
      });

      await tx.cartItem.deleteMany({
        where: { userId: userId },
      });

      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, sku: true },
              },
            },
          },
        }
      });
    });
  }

  async findOne(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, sku: true },
            },
          },
        },
      },
    });
  
    if (!order || order.userId !== userId) {
      throw new NotFoundException(`Order with id '${orderId}' not found`);
    }
  
    return order;
  }

  findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, sku: true },
            },
          },
        },
      }
    });
  }
}