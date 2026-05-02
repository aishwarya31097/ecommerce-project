import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getStrictDemo(name?: string) {
    return name?.toUpperCase() ?? 'GUEST';
  }
}
