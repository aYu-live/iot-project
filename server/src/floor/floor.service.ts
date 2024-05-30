import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Floor } from 'src/entities/floor.entity';
import { Brackets, In, Repository } from 'typeorm';

interface FloorWithLevelArray extends Omit<Floor, 'level'> {
  level: number | number[];
}
@Injectable()
export class FloorService {
  constructor(
    @InjectRepository(Floor)
    private floorRepository: Repository<Floor>,
  ) {}

  async getFloorList(params?: FloorWithLevelArray) {
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
      if (Array.isArray(params?.level)) {
        queryBuilder.andWhere('floor.level IN (:...level)', {
          level: params.level,
        });
      } else {
        queryBuilder.andWhere('floor.level = :level', { level: params.level });
      }
    }
    const [data, total] = await queryBuilder
      .addOrderBy('floor.level', 'ASC')
      .getManyAndCount();

    return [
      data.map((item) => {
        const device = item;
        device.deviceId = item?.deviceId?.filter?.((d) => !d.isDelete);
        device.ip = item.ip.filter(
          (ip) => item.deviceId.findIndex((d) => d.ip === ip) > -1,
        );
        return device;
      }),
      total,
    ];
  }

  getFloor(floor?: Partial<Floor>) {
    return this.floorRepository.findOne({
      where: {
        level: floor?.level,
      },
    });
  }

  createFloor(list: Floor[]) {
    const res = [];
    try {
      list.forEach(async (item) => {
        const floor = await this.floorRepository.findOneBy({
          level: item.level,
        });

        if (floor?.level) {
          if (Array.isArray(floor?.ip)) {
            item.ip = Array.from(new Set([...floor?.ip, ...(item?.ip || [])]));
          } else {
            item.ip = item?.ip || [];
          }
        }
        res.push(await this.floorRepository.save(item));
      });
      return res;
    } catch (err) {
      console.log(err);
    }
  }
  deleteFloor(floor: Floor | number[]) {
    let level: number | number[];
    if (Array.isArray(floor)) {
      level = floor;
    } else {
      level = floor.level;
    }

    return this.floorRepository.update(level, { isDelete: true });
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

  async renameFloor(floor: Floor) {
    console.log(floor)
    const { alias, level } = floor;
    return this.floorRepository.update(level, { alias })
  }
}
