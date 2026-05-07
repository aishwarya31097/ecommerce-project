import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ProductsModule, CartModule, OrdersModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
