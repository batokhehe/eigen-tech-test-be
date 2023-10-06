import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { RentService } from './rent.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';

@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Post()
  async create(@Body() createRentDto: CreateRentDto) {
    if (
      (await this.rentService.findMemberCountValidation(createRentDto)) >= 2
    ) {
      throw new HttpException(
        'Members may not borrow more than 2 books',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (
      (await this.rentService.bookStockValidation(createRentDto.book_code)) <= 0
    ) {
      throw new HttpException(
        'Book is out of stock',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (
      (await this.rentService.memberPenaltyValidation(
        createRentDto.member_code,
      )) > 0
    ) {
      throw new HttpException(
        'Member is currently being penalized',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!this.rentService.create(createRentDto)) {
      throw new HttpException(
        'Cannot update borrow status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!this.rentService.decBookStock(createRentDto.book_code)) {
      throw new HttpException(
        'Cannot update book stock',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      message: `Member ${createRentDto.member_code} borrow ${createRentDto.book_code} Successfully`,
      statusCod: HttpStatus.CREATED,
    };
  }

  @Get()
  findAll() {
    return this.rentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentService.findOne(+id);
  }

  @Patch()
  async update(@Body() updateRentDto: UpdateRentDto) {
    const existData = await this.rentService.findReturnValidation(
      updateRentDto,
    );
    if (!existData) {
      throw new HttpException(
        'The returned book is not a book that the member has borrowed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!this.rentService.update(updateRentDto)) {
      throw new HttpException(
        'Cannot update borrow status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!this.rentService.incBookStock(updateRentDto.book_code)) {
      throw new HttpException(
        'Cannot update book stock',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (new Date(existData.max_date) < new Date()) {
      this.rentService.memberPenalty(updateRentDto.member_code);
      throw new HttpException(
        'The book is returned after more than 7 days, the member will be subject to a penalty. Member with penalty cannot able to borrow the book for 3 days',
        HttpStatus.CREATED,
      );
    }
    return {
      message: `Member ${updateRentDto.member_code} return ${updateRentDto.book_code} Successfully`,
      statusCod: HttpStatus.CREATED,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentService.remove(+id);
  }
}
