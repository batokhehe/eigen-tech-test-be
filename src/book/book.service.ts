import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { Rent } from 'src/rent/entities/rent.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  create(createBookDto: CreateBookDto): Promise<Book> {
    const book: Book = new Book();
    book.code = createBookDto.code;
    book.title = createBookDto.title;
    book.author = createBookDto.author;
    book.stock = createBookDto.stock;
    return this.bookRepository.save(book);
  }

  findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  findOne(id: number): Promise<Book> {
    return this.bookRepository.findOneBy({ id });
  }

  update(id: number, updateBookDto: UpdateBookDto): Promise<UpdateResult> {
    const book: Book = new Book();
    book.code = updateBookDto.code;
    book.title = updateBookDto.title;
    book.author = updateBookDto.author;
    book.stock = updateBookDto.stock;
    return this.bookRepository.update(id, book);
  }

  remove(id: number): Promise<{ affected?: number }> {
    return this.bookRepository.delete(id);
  }
}
