import { Document, Schema, Types } from 'mongoose';

import { ApiProperty } from '@nestjs/swagger';

export default class PresetEntity extends Document {
  @ApiProperty({ type: String })
  readonly _id: Types.ObjectId = new Types.ObjectId();

  @ApiProperty({ type: String })
  readonly name: String = '';

  @ApiProperty({ type: String })
  readonly code: string = '';

  @ApiProperty({ type: String })
  readonly ownerId: Types.ObjectId = new Types.ObjectId();
}
