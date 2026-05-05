import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  status() {
    return {
      module: 'auth',
      ready: true,
      note: 'Auth implementation ',
    };
  }
}