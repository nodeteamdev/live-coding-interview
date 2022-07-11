import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export default class CreatePrsetDto {
    @ApiProperty({ type: String })
  readonly name: String = '';

    @ApiProperty({ type: String })
    readonly code: String = '';

    @ApiProperty({ type: Types.ObjectId })
    readonly ownerId: Types.ObjectId = new Types.ObjectId();
}
