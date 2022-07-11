import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export default class LoadPresetDto {
    @IsNotEmpty()
    @IsString()
  readonly presetId: string = '';
}
