import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}
  async addItem(dto: AddCartItemDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      select: { id: true },
    });
  
    if (!product) {
      throw new BadRequestException('Invalid productId');
    }
  
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      select: { id: true },
    });
  
    if (!user) {
      throw new BadRequestException('Invalid userId');
    }
  
    const existing = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: dto.userId,
          productId: dto.productId,
        },
      },
    });
  
    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + dto.quantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
            },
          },
        },
      });
    }
  
    try {
      return await this.prisma.cartItem.create({
        data: {
          userId: dto.userId,
          productId: dto.productId,
          quantity: dto.quantity,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
            },
          },
        },
      });
    } catch (error) {
      this.mapPrismaError(error);
    }
  }
  
  async getCart(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });
  
    if (!user) {
      throw new NotFoundException(`User with id '${userId}' not found`);
    }
  
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
          },
        },
      },
    });
  
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );
  
    return {
      user,
      items,
      summary: {
        itemCount: items.length,
        subtotal,
      },
    };
  }
  
  async updateItem(itemId: string, dto: UpdateCartItemDto) {
    await this.getCartItemOrThrow(itemId);
  
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
          },
        },
      },
    });
  }
  
  async removeItem(itemId: string) {
    await this.getCartItemOrThrow(itemId);
    return this.prisma.cartItem.delete({ where: { id: itemId } });
  }
  
  private async getCartItemOrThrow(itemId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
    });
  
    if (!item) {
      throw new NotFoundException(`Cart item with id '${itemId}' not found`);
    }
  
    return item;
  }
  
  private mapPrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid related record');
      }
    }
  
    throw error;
  }
}