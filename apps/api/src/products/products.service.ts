import {  BadRequestException,
    ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ListProductsQueryDto } from './dto/list-product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateProductDto) {
    try {
      return await this.prisma.product.create({
        data: {
          name: dto.name,
          description: dto.description,
          sku: dto.sku,
          price: dto.price,
          categoryId: dto.categoryId,
          imageUrl: dto.imageUrl ?? null,
        },
      });
    } catch (error) {
      this.mapPrismaError(error);
    }
  }

  async findAll(query: ListProductsQueryDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ProductWhereInput = {
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search } },
              { description: { contains: query.search } },
              { sku: { contains: query.search } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
  private async getProductOrThrow(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id '${id}' not found`);
    }
    return product;
  }
  async findOne(id: string) {
    return this.getProductOrThrow(id);
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.getProductOrThrow(id);

    try {
      return await this.prisma.product.update({
        where: { id },
        data: {
          ...(dto.name !== undefined ? { name: dto.name } : {}),
          ...(dto.description !== undefined ? { description: dto.description } : {}),
          ...(dto.sku !== undefined ? { sku: dto.sku } : {}),
          ...(dto.price !== undefined ? { price: dto.price } : {}),
          ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId } : {}),
          ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl } : {}),
        },
      });
    } catch (error) {
      this.mapPrismaError(error);
    }
  }

  async remove(id: string) {
    await this.getProductOrThrow(id);

    try {
      return await this.prisma.product.delete({ where: { id } });
    } catch (error) {
      this.mapPrismaError(error);
    }
  }
  private mapPrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('A product with this SKU already exists');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid categoryId or related record');
      }
    }
    throw error;
  }
}
