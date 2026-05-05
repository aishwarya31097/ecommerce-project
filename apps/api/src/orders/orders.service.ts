import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  status() {
    return {
      module: 'orders',
      ready: true,
      note: 'Orders flow implementation ',
    };
  }
}