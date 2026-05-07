import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { Prisma } from '@prisma/client';
  import { PrismaService } from '@/prisma/prisma.service';
  import { CreateCategoryDto } from './dto/create-category.dto';
  import { ListCategoriesQueryDto } from './dto/list-categories-query.dto';
  import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) {}
    async create(dto: CreateCategoryDto) {
        try {
          return await this.prisma.category.create({
            data: {
              name: dto.name,
              slug: dto.slug,
              parentId: dto.parentId ?? null,
            },
          });
        } catch (error) {
          this.mapPrismaError(error);
        }
      }
      
      async findAll(query: ListCategoriesQueryDto) {
        const where: Prisma.CategoryWhereInput = query.search
          ? {
              OR: [
                { name: { contains: query.search } },
                { slug: { contains: query.search } },
              ],
            }
          : {};
      
        return this.prisma.category.findMany({
          where,
          orderBy: { name: 'asc' },
          include: {
            _count: {
              select: { products: true, children: true },
            },
          },
        });
      }
      
      async update(id: string, dto: UpdateCategoryDto) {
        await this.getCategoryOrThrow(id);
      
        try {
          return await this.prisma.category.update({
            where: { id },
            data: {
              ...(dto.name !== undefined ? { name: dto.name } : {}),
              ...(dto.slug !== undefined ? { slug: dto.slug } : {}),
              ...(dto.parentId !== undefined ? { parentId: dto.parentId } : {}),
            },
          });
        } catch (error) {
          this.mapPrismaError(error);
        }
      }
      
      async remove(id: string) {
        const category = await this.prisma.category.findUnique({
          where: { id },
          include: {
            _count: {
              select: { products: true, children: true },
            },
          },
        });
      
        if (!category) {
          throw new NotFoundException(`Category with id '${id}' not found`);
        }
      
        if (category._count.products > 0) {
          throw new BadRequestException(
            'Cannot delete category with linked products',
          );
        }
      
        if (category._count.children > 0) {
          throw new BadRequestException(
            'Cannot delete category with child categories',
          );
        }
      
        return this.prisma.category.delete({ where: { id } });
      }
      
      private async getCategoryOrThrow(id: string) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category) {
          throw new NotFoundException(`Category with id '${id}' not found`);
        }
        return category;
      }
      
      private mapPrismaError(error: unknown): never {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ConflictException('A category with this slug already exists');
          }
      
          if (error.code === 'P2003') {
            throw new BadRequestException('Invalid parentId or related record');
          }
        }
      
        throw error;
      }
}