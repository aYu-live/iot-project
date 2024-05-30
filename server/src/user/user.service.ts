import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { In, Repository } from 'typeorm';

type PwdType = 'super' | 'normal';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  validate(info: { pwd: string; type: PwdType | PwdType[] }) {
    const { pwd, type = 'normal' } = info;
    let typeList = [];
    if (Array.isArray(type)) {
      typeList = type;
    } else {
      typeList = [type];
    }
    return this.userRepository.findOneBy({
      type: In(typeList),
      password: pwd,
    });
  }

  updateNormal(pwd: string) {
    return this.userRepository.update(
      {
        type: 'normal',
      },
      {
        password: pwd,
      },
    );
  }
}
