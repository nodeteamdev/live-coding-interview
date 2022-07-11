import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

type Selection = {
    line: number,
    ch: number,
    sticky?: string,
    xRel?: number,
};

export default class ChangeCursorsDto {
    @IsNotEmpty()
    @IsString()
  readonly room: string = '';

    @IsNotEmpty()
    @IsString()
    readonly sender: string = '';

    @IsNotEmpty()
    readonly selections: Partial<Selection[]> = [];
}
