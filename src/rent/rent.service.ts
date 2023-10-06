import { Injectable } from '@nestjs/common';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { Rent } from './entities/rent.entity';
import { IsNull, Repository, UpdateResult, getManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Book } from 'src/book/entities/book.entity';

@Injectable()
export class RentService {
  constructor(
    @InjectRepository(Rent)
    private readonly rentRepository: Repository<Rent>,
  ) {}

  create(createRentDto: CreateRentDto): Promise<Rent> {
    const rent: Rent = new Rent();
    rent.member_code = createRentDto.member_code;
    rent.book_code = createRentDto.book_code;
    rent.status = 0;
    rent.max_date = moment(new Date(), 'DD-MM-YYYY hh:mm')
      .add(7, 'days')
      .toDate();
    return this.rentRepository.save(rent);
  }

  findAll(): Promise<Rent[]> {
    return this.rentRepository.find();
  }

  findOne(id: number): Promise<Rent> {
    return this.rentRepository.findOneBy({ id });
  }

  findMemberCountValidation(createRentDto: CreateRentDto): Promise<number> {
    const condition = {
      member_code: createRentDto.member_code,
      return_date: IsNull(),
    };
    return this.rentRepository.countBy(condition);
  }

  findReturnValidation(updateRentDto: UpdateRentDto): Promise<Rent> {
    const condition = {
      member_code: updateRentDto.member_code,
      book_code: updateRentDto.book_code,
      returnDate: IsNull(),
    };
    return this.rentRepository.findOneBy(condition);
  }

  update(updateRentDto: UpdateRentDto): Promise<UpdateResult> {
    const rent: Rent = new Rent();
    rent.status = 1;
    rent.return_date = moment(new Date(), 'DD-MM-YYYY hh:mm').toDate();
    return this.rentRepository.update(
      {
        book_code: updateRentDto.book_code,
        member_code: updateRentDto.member_code,
        return_date: IsNull(),
      },
      rent,
    );
  }

  remove(id: number) {
    return `This action removes a #${id} rent`;
  }

  async incBookStock(_book_code: string): Promise<UpdateResult> {
    const db = this.rentRepository.manager;
    const query = await db.query(
      `UPDATE book SET stock = stock + 1 WHERE code = $1;`,
      [_book_code],
    );
    return query;
  }

  async decBookStock(_book_code: string): Promise<UpdateResult> {
    const db = this.rentRepository.manager;
    const query = await db.query(
      `UPDATE book SET stock = stock - 1 WHERE code = $1;`,
      [_book_code],
    );
    return query;
  }

  async memberPenalty(_member_code: string): Promise<UpdateResult> {
    const db = this.rentRepository.manager;
    const query = await db.query(
      `UPDATE member SET penalty_date = $1 WHERE code = $2;`,
      [
        moment(new Date(), 'DD-MM-YYYY hh:mm').add(3, 'days').toDate(),
        _member_code,
      ],
    );
    return query;
  }

  async memberPenaltyValidation(_member_code: string): Promise<number> {
    const db = this.rentRepository.manager;
    const query = await db.query(
      `SELECT COUNT(*) FROM public.member WHERE penalty_date > now() AND code = $1;`,
      [_member_code],
    );
    return query[0].count;
  }

  async bookStockValidation(_book_code: string): Promise<number> {
    const db = this.rentRepository.manager;
    const query = await db.query(
      `SELECT stock FROM public.book WHERE code = $1;`,
      [_book_code],
    );
    return query[0].stock;
  }
}
