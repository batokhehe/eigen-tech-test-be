import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMemberDto {
  /**
   * this decorator will help to auto generate id for the table.
   */
  id: number;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
