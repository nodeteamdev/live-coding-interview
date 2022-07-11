import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export default class CreateSessionsDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string = '';
}
