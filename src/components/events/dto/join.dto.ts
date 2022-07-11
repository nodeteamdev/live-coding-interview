import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export default class JoinDto {
    @IsNotEmpty()
    @IsString()
  readonly room: string = '';

    @IsNotEmpty()
    @IsString()
    readonly name: string = '';
}
