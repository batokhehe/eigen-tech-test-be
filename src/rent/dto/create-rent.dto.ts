import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateRentDto {
  /**
   * this decorator will help to auto generate id for the table.
   */
  id: number;

  @IsNotEmpty()
  @IsString()
  member_code: string;

  @IsNotEmpty()
  @IsString()
  book_code: string;

  @IsNotEmpty()
  @IsDate()
  max_date: Date;

  @IsNotEmpty()
  @IsDate()
  return_date: Date;
}
