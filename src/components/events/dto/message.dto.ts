import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export default class MessageDto {
    @IsNotEmpty()
    @IsString()
  readonly sender: string = '';

    @IsNotEmpty()
    @IsString()
    readonly room: string = '';

    @IsNotEmpty()
    readonly message: any;

    @IsString()
    readonly code: string = '';
}
