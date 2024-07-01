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

  async updateNormal(pwd: string, type = 'normal') {
    const user = await this.userRepository.findOneBy({
      type: type || 'normal',
    });
    if (!user?.type) {
      return this.userRepository.save({
        type: type || 'normal',
        password: pwd,
        userName: type === 'normal' ? 'admin' : 'superAdmin',
      });
    }
    return this.userRepository.update(
      {
        type: type || 'normal',
      },
      {
        password: pwd,
      },
    );
  }

  async findSuperAdmin() {
    return this.userRepository.findOneBy({
      type: 'super',
    });
  }
}
