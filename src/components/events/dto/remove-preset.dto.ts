import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export default class RemovePresetDto {
    @IsNotEmpty()
    @IsString()
  readonly ownerId: string = '';

    @IsString()
    readonly _id: string = '';
}
