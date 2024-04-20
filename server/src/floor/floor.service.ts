import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Floor } from 'src/entities/floor.entity';
import { Brackets, In, Repository } from 'typeorm';

@Injectable()
export class FloorService {
  constructor(
    @InjectRepository(Floor)
    private floorRepository: Repository<Floor>,
  ) {}

  getFloorList(params?: Floor) {
    const queryBuilder = this.floorRepository
      .createQueryBuilder('floor')
      .leftJoinAndSelect('floor.deviceId', 'device')
      .andWhere('floor.isDelete = :isDelete', { isDelete: false });
    if (params?.ip?.length) {
      const ipConditions = params.ip.map(
        (ip) => `floor.ip::text LIKE :ip${ip}`,
      );
      queryBuilder.andWhere(
        new Brackets((qb) => {
          ipConditions.forEach((condition, index) => {
            if (index === 0) {
              qb.where(condition, {
                [`ip${params.ip[index]}`]: `%${params.ip[index]}%`,
              });
            } else {
              qb.orWhere(condition, {
                [`ip${params.ip[index]}`]: `%${params.ip[index]}%`,
              });
            }
          });
        }),
      );
    }
    if (params?.level) {
      queryBuilder.andWhere('floor.level = :level', { level: params.level });
    }
    queryBuilder.addOrderBy('floor.level', 'ASC');
    return queryBuilder.getManyAndCount();
  }

  getFloor(floor?: Partial<Floor>) {
    return this.floorRepository.findOne({
      where: {
        level: floor?.level,
      },
    });
  }

  createFloor(list: Floor[]) {
    try {
      return this.floorRepository.save(list);
    } catch (err) {
      console.log(err);
    }
  }
  deleteFloor(floor: Floor) {
    return this.floorRepository.update(floor.level, { isDelete: true });
  }
  async getIpList(floor: Floor) {
    const where = {
      ip: undefined,
      level: floor?.level,
      isDelete: false,
    };
    if (floor?.ip) where.ip = In(floor.ip);
    const list = await this.floorRepository.findBy(where);
    const allIps = list.map((item) => item.ip).flat();
    const uniqueIps = [...new Set(allIps)];
    return uniqueIps;
  }
}
