import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export default class SessionsDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string = '';

  @IsNotEmpty()
  @IsString()
  readonly userId: string = '';

  @IsNotEmpty()
  @IsString()
  readonly mode: string = 'JavaScript';

  @IsNotEmpty()
  @IsString()
  readonly code: string = '// start coding!';
}
