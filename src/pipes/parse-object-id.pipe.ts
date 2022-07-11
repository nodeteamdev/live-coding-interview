import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export default class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  public transform(value: string): Types.ObjectId {
    try {
      return new Types.ObjectId(value);
    } catch (error) {
      throw new BadRequestException('Validation failed (ObjectId is expected)');
    }
  }
}
