import { Document, Schema, Types } from 'mongoose';

import { ApiProperty } from '@nestjs/swagger';

export default class SessionEntity extends Document {
  @ApiProperty({ type: String })
  readonly _id: Types.ObjectId = new Types.ObjectId();

  @ApiProperty({ type: String })
  readonly title: string = '';

  @ApiProperty({ type: String })
  readonly mode: string = '';

  @ApiProperty({ type: Boolean })
  readonly code: string = '';

  @ApiProperty({ type: Date })
  readonly createdAt: Date = new Date();
}
