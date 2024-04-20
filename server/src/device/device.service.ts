import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from 'src/entities/device.entity';
import { Brackets, Repository } from 'typeorm';

interface DeviceWithIPArray extends Omit<Device, 'ip'> {
  ip: string[];
}
@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
  ) {}

  getDeviceList(params: DeviceWithIPArray) {
    const queryBuilder = this.deviceRepository
      .createQueryBuilder('device')
      .andWhere('device.isDelete = :isDelete', { isDelete: false });
    if (params?.ip?.length) {
      const ipConditions = params.ip.map(
        (ip) => `device.ip::text LIKE :ip${ip}`,
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
      queryBuilder.andWhere('device.level = :level', { level: params.level });
    }
    queryBuilder.addOrderBy('device.id', 'ASC');
    return queryBuilder.getManyAndCount();
  }

  getDevice(params?: Partial<Device>) {
    return this.deviceRepository.findOne({
      relations: ['floor'],
      where: params,
    });
  }

  async upsertDevice(list: Device[]) {
    return this.deviceRepository.save(list);
  }

  deleteDevice(device: Device) {
    return this.deviceRepository.update(device.id, { isDelete: true });
  }
}
