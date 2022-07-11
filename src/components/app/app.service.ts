import { Injectable } from '@nestjs/common';
import open from 'open';

@Injectable()
export default class AppService {
  async openSwagger(): Promise<void> {
    const url = 'http://localhost:1337/api';

    await open(url);
  }
}
