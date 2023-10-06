import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Rent {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  member_code: string;

  @Column({ type: 'varchar', length: 50 })
  book_code: string;

  @Column({ type: 'int', nullable: true })
  status: number;

  @Column({ type: 'timestamptz', nullable: true })
  max_date: Date;

  @Column({ type: 'timestamptz', nullable: true })
  return_date: Date;

  @Column({ type: 'timestamptz', nullable: true })
  rent_date: Date;
}
