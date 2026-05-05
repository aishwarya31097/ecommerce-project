import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  status() {
    return {
      module: 'users',
      ready: true,
      note: 'Users module',
    };
  }
}