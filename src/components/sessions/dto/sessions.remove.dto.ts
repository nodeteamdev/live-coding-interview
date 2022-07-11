import {
  IsArray,
  IsNotEmpty,
} from 'class-validator';

export default class RemoveSessionsDto {
  @IsNotEmpty()
  @IsArray()
  readonly ids = [];
}
