import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getDigitalForm(): string {
    return 'Hello World!';
  }
}
