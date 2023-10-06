import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from './member/member.module';
import { BookModule } from './book/book.module';
import { RentModule } from './rent/rent.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'password',
      username: 'postgres',
      entities: [],
      database: 'test',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    MemberModule,
    BookModule,
    RentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
