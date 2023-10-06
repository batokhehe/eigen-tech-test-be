import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  create(createMemberDto: CreateMemberDto): Promise<Member> {
    const member: Member = new Member();
    member.code = createMemberDto.code;
    member.name = createMemberDto.name;
    return this.memberRepository.save(member);
  }

  findAll() {
    return this.memberRepository.manager
      .createQueryBuilder()
      .select('*')
      .addSelect(
        '(SELECT COUNT(*) FROM rent WHERE member_code = m.code)',
        'total',
      )
      .from(Member, 'm')
      .getRawMany();
  }

  findOne(id: number): Promise<Member> {
    return this.memberRepository.findOneBy({ id });
  }

  update(id: number, updateMemberDto: UpdateMemberDto): Promise<UpdateResult> {
    const member: Member = new Member();
    member.code = updateMemberDto.code;
    member.name = updateMemberDto.name;
    return this.memberRepository.update(id, member);
  }

  remove(id: number): Promise<{ affected?: number }> {
    return this.memberRepository.delete(id);
  }
}
