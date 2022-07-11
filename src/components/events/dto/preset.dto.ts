import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export default class SavePresetDto {
    @IsNotEmpty()
    @IsString()
  readonly ownerId: string = '';

    @IsString()
    readonly code: string = '';

    @IsNotEmpty()
    @IsString()
    readonly name: string = '';
}
