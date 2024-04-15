import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Floor } from 'src/entities/floor.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class FloorService {
  constructor(
    @InjectRepository(Floor)
    private floorRepository: Repository<Floor>,
  ) {}

  getFloor(params: Floor) {
    const where = {
      level: params.level,
      ip: params.ip,
      isDelete: Not(true),
    };
    if (!params.ip) delete where.ip;
    return this.floorRepository.findAndCount({
      where,
      order: {
        level: 'ASC',
      },
    });
  }
  async createFloor(list: Floor[]) {
    return this.floorRepository.save(list);
  }
  deleteFloor(floor: Floor) {
    return this.floorRepository.update(floor.level, { isDelete: true });
  }
}
