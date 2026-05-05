import { Injectable } from '@nestjs/common';

@Injectable()
export class CartService {
  status() {
    return {
      module: 'cart',
      ready: true,
      note: 'Cart business logic ',
    };
  }
}