import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export default class ModeDto {
    @IsNotEmpty()
    @IsString()
  readonly room: string = '';

    @IsNotEmpty()
    @IsString()
    readonly mode: string = '';
}
