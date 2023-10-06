import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  /**
   * this decorator will help to auto generate id for the table.
   */
  id: number;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsNumber()
  stock: number;
}
